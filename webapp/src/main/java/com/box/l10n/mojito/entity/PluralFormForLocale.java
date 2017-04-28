package com.box.l10n.mojito.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ForeignKey;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import org.hibernate.envers.Audited;
import org.hibernate.envers.RelationTargetAuditMode;

/**
 * Entity that contains plural form per locale.
 *
 * @author jaurambault
 */
@Entity
@Audited(targetAuditMode = RelationTargetAuditMode.NOT_AUDITED)
@Table(
        name = "plural_form_for_locale"
        //,
//        indexes = {
//            @Index(name = "UK__REPOSITORY_LOCALE__REPOSITORY_ID__LOCALE_ID", columnList = "repository_id, locale_id", unique = true)
//        }
)
public class PluralFormForLocale extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "locale_id", foreignKey = @ForeignKey(name = "FK__PLURAL_FORM_FOR_LOCALE__LOCALE__ID"), nullable = false)
    private Locale locale;

      
    @Column(name = "form", length = 5)
    private String form;

    public Locale getLocale() {
        return locale;
    }

    public void setLocale(Locale locale) {
        this.locale = locale;
    }

    public String getForm() {
        return form;
    }

    public void setForm(String form) {
        this.form = form;
    }}

