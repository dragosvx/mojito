
package com.box.l10n.mojito.okapi.filters;

import net.sf.okapi.common.annotation.IAnnotation;

/**
 *
 * @author jaurambault
 */
public class PluralFormAnnotation implements IAnnotation {

    String form;
    
    public PluralFormAnnotation(String form) {
        this.form = form;
    }

    public String getForm() {
        return form;
    }
    
}
