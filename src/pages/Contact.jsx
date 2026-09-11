import { useState } from "react";
import { useContent } from "../context/ContentContext.jsx";
import Reveal from "../components/Reveal.jsx";

function encodeForNetlify(data) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
}

export default function Contact() {
  const { content } = useContent();
  const { contact } = content;
  const [values, setValues] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  function handleChange(name, value) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (values["bot-field"]) return; // honeypot tripped — silently drop

    setStatus("sending");
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeForNetlify({ "form-name": "contact", ...values }),
      });
      if (!res.ok) throw new Error("Network response was not ok");
      setStatus("sent");
      setValues({});
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="px-6 py-32 md:px-12">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <h1 className="font-display text-4xl md:text-6xl">{contact.heading}</h1>
          <p className="mt-4 text-lg text-ink/75">{contact.subheading}</p>
        </Reveal>

        <Reveal delay={100}>
          {status === "sent" ? (
            <div className="glass mt-10 rounded-2xl border border-ink/10 p-7 text-center md:p-10">
              <p className="font-display text-2xl">Thanks — message sent.</p>
              <p className="mt-2 text-sm text-ink/70">
                We'll get back to you at the email you provided, usually within a day or two.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-6 rounded-btn border border-ink/25 px-5 py-2 text-sm font-semibold hover:border-coral hover:text-coral"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form
              name="contact"
              onSubmit={handleSubmit}
              className="glass mt-10 rounded-2xl border border-ink/10 p-7 md:p-8"
            >
              {/* Honeypot: real visitors never see or fill this. Bots that auto-fill every
                  field will get caught here and the submit is silently dropped above. */}
              <p className="hidden">
                <label>
                  Don't fill this out: <input onChange={(e) => handleChange("bot-field", e.target.value)} />
                </label>
              </p>

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
                        name={field.name}
                        required={field.required}
                        rows={4}
                        value={values[field.name] || ""}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className="w-full rounded-xl bg-navy-soft px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none"
                      />
                    ) : field.type === "select" ? (
                      <select
                        id={field.name}
                        name={field.name}
                        required={field.required}
                        value={values[field.name] || ""}
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
                        name={field.name}
                        type={field.type}
                        required={field.required}
                        value={values[field.name] || ""}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className="w-full rounded-xl bg-navy-soft px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none"
                      />
                    )}
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-7 w-full rounded-btn bg-coral-gradient px-6 py-3 text-sm font-semibold text-navy transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
              >
                {status === "sending" ? "Sending…" : "Send message"}
              </button>

              <p className="mt-4 text-xs text-muted">{contact.note}</p>
              {status === "error" && (
                <p className="mt-2 text-sm text-coral">
                  Something went wrong sending that — please try again, or email us directly below.
                </p>
              )}
            </form>
          )}
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
