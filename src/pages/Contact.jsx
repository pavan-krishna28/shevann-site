import { useState } from "react";
import { useContent } from "../context/ContentContext.jsx";
import Reveal from "../components/Reveal.jsx";

export default function Contact() {
  const { content } = useContent();
  const { contact } = content;
  const [values, setValues] = useState({});
  const [sent, setSent] = useState(false);

  function handleChange(name, value) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const subject = encodeURIComponent(`New inquiry: ${values.type || "General"}`);
    const bodyLines = contact.formFields.map((f) => `${f.label}: ${values[f.name] || ""}`);
    const body = encodeURIComponent(bodyLines.join("\n"));
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <section className="px-6 py-32 md:px-12">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <h1 className="font-display text-4xl md:text-6xl">{contact.heading}</h1>
          <p className="mt-4 text-lg text-ink/75">{contact.subheading}</p>
        </Reveal>

        <Reveal delay={100}>
          <form onSubmit={handleSubmit} className="glass mt-10 rounded-2xl border border-ink/10 p-7 md:p-8">
            <div className="grid gap-5">
              {contact.formFields.map((field) => (
                <div key={field.name}>
                  <label htmlFor={field.name} className="mb-1.5 block text-sm text-ink/80">
                    {field.label}
                    {field.required && <span className="text-coral"> *</span>}
                  </label>

                  {field.type === "textarea" ? (
                    <textarea
                      id={field.name}
                      required={field.required}
                      rows={4}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="w-full rounded-xl bg-navy-soft px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none"
                    />
                  ) : field.type === "select" ? (
                    <select
                      id={field.name}
                      required={field.required}
                      defaultValue=""
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="w-full rounded-xl bg-navy-soft px-4 py-3 text-sm text-ink focus:outline-none"
                    >
                      <option value="" disabled>
                        Select one
                      </option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={field.name}
                      type={field.type}
                      required={field.required}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="w-full rounded-xl bg-navy-soft px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none"
                    />
                  )}
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="mt-7 w-full rounded-full bg-coral-gradient px-6 py-3 text-sm font-semibold text-navy transition-transform hover:scale-[1.02]"
            >
              Send message
            </button>

            <p className="mt-4 text-xs text-muted">{contact.note}</p>
            {sent && <p className="mt-2 text-sm text-amber">Your email client should now be open with your message.</p>}
          </form>
        </Reveal>

        <p className="mt-6 text-sm text-ink/70">
          Or email us directly at{" "}
          <a href={`mailto:${contact.email}`} className="text-coral">
            {contact.email}
          </a>
        </p>
      </div>
    </section>
  );
}
