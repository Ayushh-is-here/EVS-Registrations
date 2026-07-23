import { motion } from 'framer-motion';

import KineticHeading from './KineticHeading';

const Guidelines = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-2xl px-4"
    >
      <div className="editorial-card !max-w-none !p-0 mx-auto">
        <div className="p-8 md:p-10 w-full h-full flex flex-col gap-6 text-ink">
          <div className="text-center mb-4">
            <KineticHeading as="h1" text="Presentation Guidelines" className="text-4xl text-ink font-heading" glowSweep />
          </div>

          <section>
            <h2 className="text-xl font-semibold mb-2">1. Format & Content</h2>
            <ul className="list-disc pl-5 space-y-2 text-ink-light leading-relaxed">
              <li>Presentations should be focused on Environmental Studies and sustainable practices.</li>
              <li>Your slide deck must be submitted in <strong>PDF format</strong> to ensure compatibility.</li>
              <li>Include a clear title slide with your Topic, Name, and Division.</li>
              <li>Limit text on slides; use bullet points and compelling visuals to support your points.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. Time Limits</h2>
            <ul className="list-disc pl-5 space-y-2 text-ink-light leading-relaxed">
              <li>Each presentation is strictly limited to <strong>5 minutes</strong>.</li>
              <li>A 2-minute Q&A session will follow immediately after your presentation.</li>
              <li>Please rehearse to ensure you do not exceed your allotted time.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3. Submission Rules</h2>
            <ul className="list-disc pl-5 space-y-2 text-ink-light leading-relaxed">
              <li>You must register your topic first on the <a href="/register" className="text-accent underline">Registration</a> page.</li>
              <li>Once registered, you can upload your presentation via the <a href="/upload" className="text-accent underline">Upload</a> page.</li>
              <li>The maximum file size allowed is <strong>50MB</strong>.</li>
              <li>Make sure to bring a backup of your presentation on a USB drive on the day of the event.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">4. Evaluation Criteria</h2>
            <ul className="list-disc pl-5 space-y-2 text-ink-light leading-relaxed">
              <li>Relevance to Environmental Studies</li>
              <li>Clarity and structure of arguments</li>
              <li>Quality of research and data presented</li>
              <li>Communication skills and ability to answer questions</li>
            </ul>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default Guidelines;
