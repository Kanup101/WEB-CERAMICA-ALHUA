const faqs = [
  {
    question: "Hacen envios?",
    answer:
      "Si, preparamos cada pieza con embalaje cuidado. En esta etapa los envios se coordinan de forma manual.",
  },
  {
    question: "Las piezas son todas iguales?",
    answer:
      "No. Incluso cuando una serie se repite, cada pieza puede tener pequenas variaciones propias del trabajo manual.",
  },
  {
    question: "Como funcionan los talleres online?",
    answer:
      "Los talleres combinan encuentros en vivo, material descargable y acompanamiento. La modalidad final se informa en cada taller.",
  },
];

export function FAQAccordion() {
  return (
    <div className="divide-y divide-[#DCCAB2] rounded-3xl border border-[#DCCAB2] bg-[#FFF9EF]">
      {faqs.map((faq) => (
        <details key={faq.question} className="group p-6">
          <summary className="cursor-pointer list-none text-base font-semibold text-[#342A24]">
            <span className="flex items-center justify-between gap-4">
              {faq.question}
              <span className="text-xl text-[#9A6B50] transition group-open:rotate-45">+</span>
            </span>
          </summary>
          <p className="mt-3 text-sm leading-6 text-[#6C5C50]">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
