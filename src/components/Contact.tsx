import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

export const Contact: React.FC = () => {
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
    }, 4200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.user_name.trim() ||
      !formData.user_email.trim() ||
      !formData.user_message.trim()
    ) {
      setStatusMessage({
        text: 'Field input tidak boleh kosong',
        type: 'red',
      });
      return;
    }

    if (!formRef.current) return;

    setIsSubmitting(true);
    setStatusMessage({
      text: 'Mengirim pesan...',
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
        text: 'Pesan telah dikirim',
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
      // Fallback: If EmailJS quota or network fails, inform user gracefully
      setStatusMessage({
        text: 'Pengiriman pesan belum berhasil. Anda juga dapat menghubungi langsung ke amathmrs02@gmail.com',
        type: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact section" id="contact">
      <h2 className="section__title">Contact Me</h2>
      <span className="section__subtitle"></span>

      <div className="contact__container container grid">
        <div>
          <div className="contact__information">
            <i className="uil uil-envelope contact__icon"></i>
            <div>
              <h3 className="contact__title">E-Mail</h3>
              <a className="contact__subtitle" href="mailto:amathmrs02@gmail.com">
                amathmrs02@gmail.com
              </a>
            </div>
          </div>

          <div className="contact__information">
            <i className="uil uil-map-marker contact__icon"></i>
            <div>
              <h3 className="contact__title">Location</h3>
              <span className="contact__subtitle">Indonesia - DKI Jakarta</span>
            </div>
          </div>
        </div>

        <form
          ref={formRef}
          className="contact__form grid"
          id="contact-form"
          onSubmit={handleSubmit}
        >
          <div className="contact__inputs grid">
            <div className="contact__content">
              <label htmlFor="contact-name" className="contact__label">
                Name
              </label>
              <input
                type="text"
                className="contact__input"
                id="contact-name"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>
            <div className="contact__content">
              <label htmlFor="contact-email" className="contact__label">
                E-Mail
              </label>
              <input
                type="email"
                className="contact__input"
                id="contact-email"
                name="user_email"
                value={formData.user_email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="contact__content">
            <label htmlFor="user-message" className="contact__label">
              Message
            </label>
            <textarea
              name="user_message"
              id="user-message"
              rows={7}
              className="contact__input"
              value={formData.user_message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {statusMessage.text && (
            <p
              className={`contact__message ${
                statusMessage.type ? `color-${statusMessage.type}` : ''
              }`}
              id="contact-message"
              role="status"
              aria-live="polite"
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                fontSize: 'var(--small-font-size)',
                marginBottom: '1rem',
              }}
            >
              {statusMessage.text}
            </p>
          )}

          <div>
            <button
              type="submit"
              name="submit"
              className="button contact__button button--flex"
              id="contact-button"
              disabled={isSubmitting}
              style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
            >
              <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              <i className="uil uil-message button__icon"></i>
            </button>
          </div>
        </form>
      </div>

      {/* Legacy/Floating Toast Notification */}
      {showNotification && (
        <div
          id="email-success-notification"
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            top: '24px',
            left: '50%',
            zIndex: 999999,
            maxWidth: 'calc(100vw - 32px)',
            padding: '14px 22px',
            borderRadius: '16px',
            fontFamily: 'inherit',
            fontSize: '15px',
            fontWeight: 600,
            lineHeight: 1.5,
            textAlign: 'center',
            color: '#166534',
            background: '#dcfce7',
            border: '1px solid rgba(34, 197, 94, .45)',
            boxShadow: '0 20px 50px rgba(15, 23, 42, .22)',
            transform: 'translate(-50%, 0)',
            transition: 'opacity .25s ease, transform .25s ease',
          }}
        >
          Pesan berhasil dikirim
        </div>
      )}
    </section>
  );
};
