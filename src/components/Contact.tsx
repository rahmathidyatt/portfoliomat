import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { Mail, MapPin, CheckCircle, Copy, Send, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

export const Contact: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_message: '',
  });
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: 'red' | 'green' | 'blue' | '';
  }>({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(t.contact.emailValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const triggerToastNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 4500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.user_name.trim() ||
      !formData.user_email.trim() ||
      !formData.user_message.trim()
    ) {
      setStatusMessage({
        text: t.contact.errorEmpty,
        type: 'red',
      });
      return;
    }

    if (!formRef.current) return;

    setIsSubmitting(true);
    setStatusMessage({
      text: t.contact.sendingStatus,
      type: 'blue',
    });

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_39oxs8i',
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_lykg67g',
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'QvQIyg2CW3CKLIkS9'
      );

      setStatusMessage({
        text: t.contact.successStatus,
        type: 'green',
      });
      triggerToastNotification();

      setFormData({
        user_name: '',
        user_email: '',
        user_message: '',
      });

      setTimeout(() => {
        setStatusMessage({ text: '', type: '' });
      }, 5000);
    } catch (err) {
      console.warn('EmailJS error:', err);
      setStatusMessage({
        text: t.contact.errorStatus,
        type: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="section__header">
          <h2 className="section__title">{t.contact.title}</h2>
          <p className="section__subtitle">{t.contact.subtitle}</p>
        </div>

        <div className="contact-grid">
          {/* Contact Information Cards */}
          <div className="contact-info-panel">
            <div className="contact-info-card">
              <div className="contact-info-card__icon">
                <Mail size={22} />
              </div>
              <div style={{ flexGrow: 1 }}>
                <span className="contact-info-card__title">{t.contact.emailTitle}</span>
                <div className="contact-info-card__value">
                  <a href={`mailto:${t.contact.emailValue}`} style={{ color: 'inherit' }}>
                    {t.contact.emailValue}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0.2rem 0',
                    marginTop: '0.35rem',
                    cursor: 'pointer',
                    fontSize: 'var(--smaller-font-size)',
                    color: copied ? '#10b981' : 'var(--first-color)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontWeight: 600,
                  }}
                >
                  {copied ? <CheckCircle size={13} /> : <Copy size={13} />}
                  <span>{copied ? t.contact.copiedEmail : t.contact.copyEmail}</span>
                </button>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-card__icon">
                <MapPin size={22} />
              </div>
              <div>
                <span className="contact-info-card__title">{t.contact.locationTitle}</span>
                <div className="contact-info-card__value">{t.contact.locationValue}</div>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-card__icon">
                <Clock size={22} />
              </div>
              <div>
                <span className="contact-info-card__title">{t.contact.statusTitle}</span>
                <div className="contact-info-card__value" style={{ fontSize: 'var(--small-font-size)', fontWeight: 500 }}>
                  {t.contact.statusValue}
                </div>
              </div>
            </div>
          </div>

          {/* Form Panel */}
          <div className="contact-form-panel">
            <form
              ref={formRef}
              id="contact-form"
              onSubmit={handleSubmit}
            >
              <div className="form-group-row">
                <div className="form-field" style={{ marginBottom: 0 }}>
                  <label htmlFor="contact-name">{t.contact.nameLabel}</label>
                  <input
                    type="text"
                    id="contact-name"
                    name="user_name"
                    className="form-input"
                    placeholder={t.contact.namePlaceholder}
                    value={formData.user_name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="form-field" style={{ marginBottom: 0 }}>
                  <label htmlFor="contact-email">{t.contact.emailLabel}</label>
                  <input
                    type="email"
                    id="contact-email"
                    name="user_email"
                    className="form-input"
                    placeholder={t.contact.emailPlaceholder}
                    value={formData.user_email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="user-message">{t.contact.messageLabel}</label>
                <textarea
                  id="user-message"
                  name="user_message"
                  rows={5}
                  className="form-textarea"
                  placeholder={t.contact.messagePlaceholder}
                  value={formData.user_message}
                  onChange={handleChange}
                  required
                />
              </div>

              {statusMessage.text && (
                <div
                  className={`form-status-alert ${statusMessage.type ? `color-${statusMessage.type}` : ''}`}
                  role="status"
                  aria-live="polite"
                >
                  {statusMessage.text}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="button button--flex"
                  disabled={isSubmitting}
                  style={{ width: '100%', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                >
                  <span>{isSubmitting ? t.contact.sendingButton : t.contact.sendButton}</span>
                  <Send size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Global Toast Notification */}
        {showNotification && (
          <div
            role="status"
            aria-live="polite"
            style={{
              position: 'fixed',
              top: '24px',
              left: '50%',
              zIndex: 999999,
              maxWidth: 'calc(100vw - 32px)',
              padding: '12px 24px',
              borderRadius: '2rem',
              fontSize: '14px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#065f46',
              background: '#ecfdf5',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
              transform: 'translate(-50%, 0)',
              animation: 'fadeIn 0.3s ease',
            }}
          >
            <CheckCircle size={16} />
            <span>{t.contact.toastSuccess}</span>
          </div>
        )}
      </div>
    </section>
  );
};
