package com.box.l10n.mojito.okapi.filters;

import com.box.l10n.mojito.okapi.POExtraPluralAnnotation;
import com.box.l10n.mojito.okapi.TextUnitUtils;
import com.ibm.icu.text.PluralRules;
import com.ibm.icu.util.ULocale;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import net.sf.okapi.common.Event;
import net.sf.okapi.common.EventType;
import net.sf.okapi.common.IResource;
import net.sf.okapi.common.LocaleId;
import net.sf.okapi.common.filters.FilterConfiguration;
import net.sf.okapi.common.resource.ITextUnit;
import net.sf.okapi.common.resource.Property;
import net.sf.okapi.common.resource.RawDocument;
import net.sf.okapi.common.resource.TextContainer;
import net.sf.okapi.common.resource.TextUnit;
import net.sf.okapi.common.skeleton.GenericSkeleton;
import net.sf.okapi.common.skeleton.GenericSkeletonPart;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;

/**
 *
 * @author jaurambault
 */
@Configurable
public class AndroidFilter extends XMLFilter {

    /**
     * logger
     */
    static Logger logger = LoggerFactory.getLogger(AndroidFilter.class);

    public static final String ANDROIDSTRINGS_CONFIG_FILE_NAME = "AndroidStrings_mojito.fprm";

    public static final String FILTER_CONFIG_ID = "okf_xml@mojito-AndroidStrings";

    private static final String XML_COMMENT_PATTERN = "<!--(?<comment>.*?)-->";
    private static final String XML_COMMENT_GROUP_NAME = "comment";

    @Autowired
    TextUnitUtils textUnitUtils;

    @Override
    public String getName() {
        return FILTER_CONFIG_ID;
    }

    @Override
    public List<FilterConfiguration> getConfigurations() {
        List<FilterConfiguration> list = new ArrayList<>();
        list.add(new FilterConfiguration(getName(),
                getMimeType(),
                getClass().getName(),
                "Android Strings",
                "Configuration for Android Strings XML documents.",
                ANDROIDSTRINGS_CONFIG_FILE_NAME));

        return list;
    }

    LocaleId targetLocale;

    boolean hasAnnotation;

    @Override
    public void open(RawDocument input) {
        super.open(input);
        targetLocale = input.getTargetLocale();
        hasAnnotation = input.getAnnotation(POExtraPluralAnnotation.class) != null;
    }

    List<Event> eventQueue = new ArrayList<>();

    @Override
    public boolean hasNext() {
        return !eventQueue.isEmpty() || super.hasNext();
    }

    @Override
    public Event next() {
        Event event;

        if (eventQueue.isEmpty()) {
            readNextEvents();
        }

        event = eventQueue.remove(0);

        return event;
    }

    private void processTextUnit(Event event) {
        if (event != null && event.isTextUnit()) {
            // if source has escaped double-quotes, single-quotes, \r or \n, unescape
            TextUnit textUnit = (TextUnit) event.getTextUnit();
            String sourceString = textUnit.getSource().toString();
            String unescapedSourceString = unescape(sourceString);
            TextContainer source = new TextContainer(unescapedSourceString);
            textUnit.setSource(source);
            extractNoteFromXMLCommentInSkeletonIfNone(textUnit);
        }
    }

    protected boolean isPluralGroupStarting(IResource resource) {
        String toString = resource.getSkeleton().toString();
        Pattern p = Pattern.compile("<plurals");
        Matcher matcher = p.matcher(toString);
        boolean startPlural = matcher.find();
        return startPlural;
    }

    protected boolean isPluralGroupEnding(IResource resource) {
        String toString = resource.getSkeleton().toString();
        Pattern p = Pattern.compile("</plurals>");
        Matcher matcher = p.matcher(toString);
        boolean endPlural = matcher.find();
        return endPlural;
    }

    protected String getPluralFormFromSkeleton(IResource resource) {
        String toString = resource.getSkeleton().toString();
        Pattern p = Pattern.compile("<.*?item.+?quantity.+?\"(.+?)\"");
        Matcher matcher = p.matcher(toString);
        String res = null;
        if (matcher.find()) {
            res = matcher.group(1);
        }
        return res;
    }

    /**
     * Extract the note from XML comments only if there is no note on the text
     * unit. In other words if a note was specify via attribute like description
     * for android it won't be overridden by an comments present in the XML
     * file.
     *
     * @param textUnit the text unit for which comments should be extracted
     */
    protected void extractNoteFromXMLCommentInSkeletonIfNone(TextUnit textUnit) {

        String skeleton = textUnit.getSkeleton().toString();

        if (textUnit.getProperty(Property.NOTE) == null) {
            String note = getNoteFromXMLCommentsInSkeleton(skeleton);
            if (note != null) {
                textUnit.setProperty(new Property(Property.NOTE, note));
            }
        }
    }

    /**
     * Gets the note from the XML comments in the skeleton.
     *
     * @param skeleton that may contains comments
     * @return the note or <code>null</code>
     */
    protected String getNoteFromXMLCommentsInSkeleton(String skeleton) {

        String note = null;

        StringBuilder commentBuilder = new StringBuilder();

        Pattern pattern = Pattern.compile(XML_COMMENT_PATTERN);
        Matcher matcher = pattern.matcher(skeleton);

        while (matcher.find()) {
            if (commentBuilder.length() > 0) {
                commentBuilder.append(" ");
            }
            commentBuilder.append(matcher.group(XML_COMMENT_GROUP_NAME).trim());
        }

        if (commentBuilder.length() > 0) {
            note = commentBuilder.toString();
        }

        return note;
    }

    private String unescape(String text) {
        String unescapedText = text.replaceAll("(\\\\)(\"|')", "$2");
        unescapedText = unescapedText.replaceAll("\\\\n", "\n");
        unescapedText = unescapedText.replaceAll("\\\\r", "\r");
        return unescapedText;
    }

    @Override
    public XMLEncoder getXMLEncoder() {
        XMLEncoder xmlEncoder = new XMLEncoder();
        xmlEncoder.setAndroidStrings(true);
        return xmlEncoder;
    }

    protected List<String> getPluralForms(LocaleId localeId) {
        
        List<String> keywords = new ArrayList<>();

        keywords.add("zero");
        keywords.add("one");
        keywords.add("two");
        keywords.add("few");
        keywords.add("many");
        keywords.add("other");

        if (localeId != null && !LocaleId.EMPTY.equals(localeId)) {
            ULocale ulocale = ULocale.forLanguageTag(localeId.toBCP47());
            PluralRules pluralRules = PluralRules.forLocale(ulocale);
            keywords.retainAll(pluralRules.getKeywords());
        }

        logger.info("Plural form for {}: {}", localeId, keywords);
        return keywords;
    }

    private void readNextEvents() {
        Event next = getNextWithProcess();

        if (next.isTextUnit() && isPluralGroupStarting(next.getResource())) {
            readPlurals(next);
        } else {
            eventQueue.add(next);
        }
    }

    private Event getNextWithProcess() {
        Event next = super.next();
        processTextUnit(next);
        return next;
    }

    private void readPlurals(Event next) {

        List<Event> pluralEvents = new ArrayList<>();

        // add the start event
        pluralEvents.add(next);

        next = getNextWithProcess();

        // read others until the end
        while (next != null && !isPluralGroupEnding(next.getResource())) {
            pluralEvents.add(next);
            next = getNextWithProcess();
        }

        // that doesn't contain last
        pluralEvents = adaptPlurals(pluralEvents);
        
        eventQueue.addAll(pluralEvents);

        if (isPluralGroupStarting(next.getResource())) {
            readPlurals(next);
        } else {
            eventQueue.add(next);
        }
    }

    protected List<Event> adaptPlurals(List<Event> pluralEvents) {
        logger.info("Adapt plural forms if needed");
        PluralsHolder pluralsHolder = new PluralsHolder();
        pluralsHolder.loadEvents(pluralEvents);
        List<Event> completedForms = pluralsHolder.getCompletedForms(targetLocale);
        return completedForms;
    }

    protected class PluralsHolder {

        String firstForm = null;
        String comments = null;
        Event zero = null;
        Event one = null;
        Event two = null;
        Event few = null;
        Event many = null;
        Event other = null;

        public List<Event> getCompletedForms(LocaleId localeId) {

            List<Event> newForms = new ArrayList<>();

            List<String> pluralForms = getPluralForms(targetLocale);

            String newFirstForm = null;

            for (String pluralForm : pluralForms) {

                logger.info("Processing form: {} for {}", pluralForm, localeId.toBCP47());
                if (newFirstForm == null) {
                    newFirstForm = pluralForm;
                }

                if ("zero".equals(pluralForm)) {
                    if (zero == null) {
                        zero = createCopyOfOther("zero");
                    }
                    zero.getTextUnit().setAnnotation(new PluralFormAnnotation("zero"));
                    newForms.add(zero);
                }

                if ("one".equals(pluralForm)) {
                    if (one == null) {
                        one = createCopyOfOther("one");
                    }
                    one.getTextUnit().setAnnotation(new PluralFormAnnotation("one"));
                    newForms.add(one);
                }

                if ("two".equals(pluralForm)) {
                    if (two == null) {
                        two = createCopyOfOther("two");
                    }
                    two.getTextUnit().setAnnotation(new PluralFormAnnotation("two"));
                    newForms.add(two);
                }

                if ("few".equals(pluralForm)) {
                    if (few == null) {
                        few = createCopyOfOther("few");
                    }
                    few.getTextUnit().setAnnotation(new PluralFormAnnotation("few"));
                    newForms.add(few);
                }

                if ("many".equals(pluralForm)) {
                    if (many == null) {
                        many = createCopyOfOther("many");
                    }
                    many.getTextUnit().setAnnotation(new PluralFormAnnotation("many"));
                    newForms.add(many);
                }

                if ("other".equals(pluralForm)) {
                    other.getTextUnit().setAnnotation(new PluralFormAnnotation("other"));
                    newForms.add(other);
                }
            }

            for (Event newForm : newForms) {
                if (comments != null) {
                    newForm.getTextUnit().setProperty(new Property(Property.NOTE, comments));
                }
            }

            swapSkeletonBetweenOldFirstAndNewFirst(newFirstForm);

            return newForms;
        }

        private void swapSkeletonBetweenOldFirstAndNewFirst(String newFirstForm) {
            if (newFirstForm != null && !newFirstForm.equals(firstForm)) {
                logger.info("Swapping the old first form with the new first form, as it contains the skeleton");
                Event oldFirst = getEventFromName(firstForm);
                Event newFirst = getEventFromName(newFirstForm);

                GenericSkeleton oldSkeleton = (GenericSkeleton) oldFirst.getTextUnit().getSkeleton();
                replaceFormInSkeleton(oldSkeleton, firstForm, newFirstForm);
                
                GenericSkeleton newSkeleton = (GenericSkeleton) newFirst.getTextUnit().getSkeleton();
                replaceFormInSkeleton(newSkeleton, newFirstForm, firstForm);

                oldFirst.getTextUnit().setSkeleton(newSkeleton);
                newFirst.getTextUnit().setSkeleton(oldSkeleton);
            }
        }

        protected void replaceFormInSkeleton(GenericSkeleton genericSkeleton, String fromForm, String toForm) {
            logger.debug("Replace form: {} to {} in skeleton", fromForm, toForm);
            for (GenericSkeletonPart part : genericSkeleton.getParts()) {
                StringBuilder sb = part.getData();
                //TODO make more flexible
                String str = sb.toString().replace(fromForm + "\"", toForm + "\"");
                sb.replace(0, sb.length(), str);
            }
        }

        protected Event getEventFromName(String form) {
            Event event = null;
            switch (form) {
                case "zero":
                    event = zero;
                    break;
                case "one":
                    event = one;
                    break;
                case "two":
                    event = two;
                    break;
                case "few":
                    event = few;
                    break;
                case "many":
                    event = many;
                    break;
                case "other":
                    event = other;
                    break;
                default:
                    logger.error("Invalid plural form");
                    break;
            }
            return event;
        }

        protected Event createCopyOfOther(String form) {
            ITextUnit textUnit = other.getTextUnit().clone();
            Pattern p = Pattern.compile("_other$");
            Matcher matcher = p.matcher(textUnit.getName());
            String newName = matcher.replaceAll("_" + form );
            
            textUnit.setName(newName);
            GenericSkeleton genericSkeleton = (GenericSkeleton) textUnit.getSkeleton();
            
            for (GenericSkeletonPart part : genericSkeleton.getParts()) {
                StringBuilder sb = part.getData();
                //TODO make more flexible
                String str = sb.toString().replace("other\"", form + "\"");
                sb.replace(0, sb.length(), str);
            }

            Event copyOfOther = new Event(EventType.TEXT_UNIT, textUnit);
            return copyOfOther;
        }

        String skeletonStart = null;

        protected void loadEvents(List<Event> pluralEvents) {

            firstForm = null; 

            for (Event pluralEvent : pluralEvents) {
                String pluralFormFromSkeleton = getPluralFormFromSkeleton(pluralEvent.getResource());

                if (firstForm == null) {
                    firstForm = pluralFormFromSkeleton;
                    ITextUnit firstTextUnit = pluralEvent.getTextUnit();
                    comments = textUnitUtils.getNote(firstTextUnit);
                }

                if (null != pluralFormFromSkeleton) {
                    switch (pluralFormFromSkeleton) {
                        case "zero":
                            zero = pluralEvent;
                            break;
                        case "one":
                            one = pluralEvent;
                            break;
                        case "two":
                            two = pluralEvent;
                            break;
                        case "few":
                            few = pluralEvent;
                            break;
                        case "many":
                            many = pluralEvent;
                            break;
                        case "other":
                            other = pluralEvent;
                            break;
                        default:
                            logger.error("Invalid plural form");
                            break;
                    }
                }
            }
        }
    }

}
