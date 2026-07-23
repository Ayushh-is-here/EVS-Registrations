import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ChevronDown, Check, Copy, HelpCircle, BookOpenCheck, ChevronUp } from 'lucide-react';
import KineticHeading from './KineticHeading';

interface Question {
  id: number;
  question: string;
  answer: string;
}

interface Assignment {
  id: number;
  title: string;
  subtitle: string;
  questions: Question[];
}

const ASSIGNMENTS_DATA: Assignment[] = [
  {
    id: 1,
    title: 'EVS Assignment 1',
    subtitle: 'Environmental Studies Core Concepts & Answers (~200 words each)',
    questions: [
      {
        id: 1,
        question: 'What is water security?',
        answer: `Water security is defined by the United Nations as the capacity of a population to safeguard sustainable access to adequate quantities of acceptable quality water for sustaining livelihoods, human well-being, and socio-economic development. It includes protecting against water-borne pollution and water-related disasters while preserving aquatic ecosystems.

Water security rests on four core pillars:
1. Physical Availability: Adequate freshwater in rivers, aquifers, and reservoirs.
2. Equitable Access: Infrastructure and economic means to distribute water without discrimination.
3. Water Quality: Water free from hazardous chemicals and biological pathogens.
4. Hydrological Stability: Resilience against droughts, floods, and climate variability.

Global population growth, rapid urbanization, industrial pollution, and climate change increasingly threaten water security. Scarcity leads to agricultural decline, public health crises, and geopolitical conflict over shared river basins. Achieving water security requires integrated watershed management, rainwater harvesting, efficient drip irrigation, and international water governance.`
      },
      {
        id: 2,
        question: 'What is water management?',
        answer: `Water management is the strategic planning, developing, distributing, and managing of water resources to meet human, agricultural, industrial, and ecological needs while mitigating flood and drought risks. Integrated Water Resources Management (IWRM) is the global framework used to coordinate water and land resources sustainably.

Key management strategies include:
• Supply-Side Management: Constructing reservoirs, rainwater harvesting systems, desalination plants, and groundwater recharge infrastructure.
• Demand-Side Management: Promoting water conservation, public awareness, efficient pricing tariffs, and precision drip irrigation in agriculture (which consumes nearly 70% of global freshwater).
• Wastewater Treatment & Recycling: Treating municipal and industrial effluents for non-potable reuse in cooling towers, urban landscaping, and aquifer replenishment.

Effective water management balances competing demands among municipalities, industries, and agriculture while enforcing environmental protection laws to prevent aquifer depletion and river degradation.`
      },
      {
        id: 3,
        question: 'What is eco tourism?',
        answer: `Ecotourism is responsible travel to natural areas that conserves the environment, sustains the well-being of local people, and involves interpretation and education for visitors and hosts. Unlike conventional mass tourism, which often causes carbon pollution and habitat destruction, ecotourism prioritizes environmental stewardship and socio-economic equity.

Core principles of ecotourism include:
1. Minimizing physical and ecological impacts on fragile natural ecosystems and wildlife.
2. Fostering environmental awareness and cultural respect among tourists.
3. Providing direct financial support for national parks, reserves, and conservation projects.
4. Creating sustainable employment and economic empowerment for local indigenous communities.

Activities include guided nature walks, birdwatching, ethical wildlife safaris, and cultural immersion stays in sensitive biomes like rainforests and coral reefs. When managed properly, ecotourism creates economic incentives for local communities to protect biodiversity rather than engaging in illegal logging, poaching, or slash-and-burn agriculture.`
      },
      {
        id: 4,
        question: 'What is sustainable agriculture?',
        answer: `Sustainable agriculture is an integrated farming system that satisfies human food and fiber needs while enhancing environmental quality, conserving non-renewable resources, and maintaining the economic viability of farm operations. It offers an eco-friendly alternative to industrial monoculture, which relies heavily on synthetic chemical fertilizers and toxic pesticides.

Key practices of sustainable agriculture include:
• Crop Rotation & Diversification: Alternating crops to naturally break pest cycles and replenish nitrogen levels in soil.
• Soil Conservation & Zero-Till: Cover cropping and composting to reduce topsoil erosion and improve moisture retention.
• Integrated Pest Management (IPM): Utilizing biological controls and natural predators to control pests with minimal chemical sprays.
• Precision Water Management: Implementing drip irrigation and rainwater catchment to prevent agricultural runoff.
• Agroforestry: Integrating trees with crops and livestock to enhance biodiversity and sequester carbon.

Sustainable agriculture protects pollinators, improves long-term soil fertility, and mitigates climate change by storing carbon in healthy soils.`
      },
      {
        id: 5,
        question: 'What is solid waste management?',
        answer: `Solid waste management encompasses the systematic collection, transportation, processing, recycling, and disposal of solid waste generated by municipal, commercial, industrial, and residential activities. Uncontrolled waste dumping pollutes groundwater through toxic leachate, releases methane emissions, and harms marine ecosystems.

Modern waste management follows the Waste Hierarchy (The 5 Rs):
1. Refuse / Reduce: Minimizing waste generation at the source by avoiding single-use plastics.
2. Reuse: Extending product lifecycle through repair and repurposing.
3. Recycle: Processing materials like glass, paper, metals, and plastics into new products.
4. Recover: Converting non-recyclable waste into energy via incineration or biogas digestion.
5. Responsibly Dispose: Depositing residual waste into engineered sanitary landfills with protective liners.

Effective waste management requires household source segregation, public awareness, informal waste-picker integration, and Extended Producer Responsibility (EPR) policies holding manufacturers accountable for post-consumer waste.`
      },
      {
        id: 6,
        question: 'What is population growth?',
        answer: `Population growth refers to the change in the number of individuals in a demographic population over time, determined by crude birth rates, crude death rates, and net migration. Human population accelerated rapidly during the Industrial and Green Revolutions due to breakthroughs in medical science, public sanitation, and agricultural production.

Demographers model population trends using the Demographic Transition Model (DTM) across four stages:
1. High birth and death rates (pre-industrial balance).
2. Declining death rates with high birth rates (rapid population growth).
3. Declining birth rates due to urbanization and education.
4. Low birth and death rates (post-industrial demographic stability).

Unchecked population growth places heavy demands on land, water, energy, and food resources, accelerating deforestation and greenhouse gas emissions. Sustainable demographic management relies on empowering women through higher education, reproductive healthcare, and economic independence.`
      },
      {
        id: 7,
        question: 'Explain the population density and the pattern of population density.',
        answer: `Population density measures the number of individuals living within a specific geographical area, typically expressed as people per square kilometer (people/km²). It reflects how human populations are distributed across landscapes based on physical, economic, and social factors.

Global patterns of population density are highly uneven:
• Densely Populated Areas: Coastal plains, fertile river valleys (e.g., the Nile Delta, Indo-Gangetic Plain), temperate climate zones, and major industrial cities exhibit high densities exceeding 1,000 people/km². Abundant freshwater, arable soil, flat terrain, and employment opportunities naturally attract human settlement.
• Sparsely Populated Areas: Extreme environments like hyper-arid deserts (Sahara), polar ice caps (Greenland), dense rainforests (Amazon), and rugged mountain ranges (Himalayas) have low densities (<10 people/km²) due to harsh climates and poor accessibility.

Analyzing density patterns enables urban planning, infrastructure allocation, and natural ecosystem preservation.`
      },
      {
        id: 8,
        question: 'In short explain rural and urban population.',
        answer: `Human populations are classified as rural or urban based on settlement density, built infrastructure, and primary economic activities.

Rural Population:
Rural populations live in villages and countryside settlements characterized by low population density and open land. Economic life centers on primary sector activities: agriculture, forestry, fishing, livestock farming, and mining. Rural areas feature traditional social bonds and lower living costs, but often face challenges such as limited access to advanced healthcare, specialized higher education, digital connectivity, and job opportunities.

Urban Population:
Urban populations reside in towns, cities, and metropolitan regions defined by high population density and built infrastructure. Economic activities center on secondary (manufacturing, construction) and tertiary/quaternary sectors (services, technology, finance, administration). While urban areas offer superior healthcare, higher wages, and diverse amenities, unplanned urban growth leads to traffic congestion, high housing costs, air pollution, and slum expansion.`
      },
      {
        id: 9,
        question: 'What is different types of agriculture?',
        answer: `Agriculture is practiced in various forms depending on regional climate, topography, technology, and market goals. The major types of agriculture include:

1. Subsistence Farming: Practiced by smallholder farmers to feed their households using traditional tools.
   - Shifting Cultivation: Clearing forest plots, farming until nutrients deplete, then moving on.
   - Intensive Subsistence: High labor input on small plots, typical of Asian rice cultivation.
2. Commercial Farming: Large-scale farming aimed at market sale for profit.
   - Commercial Grain Farming: Mechanized monoculture production of crops like wheat and corn.
   - Plantation Agriculture: Single cash crops (tea, coffee, sugarcane, rubber) grown on large estates for export.
3. Livestock Systems: Nomadic herding in drylands or commercial ranching on enclosed lands.
4. Mixed Farming: Integrating crop cultivation and livestock raising on the same farm.
5. Organic Farming: Chemical-free farming prioritizing natural soil fertility and biodiversity.`
      },
      {
        id: 10,
        question: 'Discuss on climate change in the world.',
        answer: `Global climate change refers to long-term shifts in temperatures and weather patterns driven primarily by human activities since the Industrial Revolution. Burning fossil fuels (coal, oil, gas), deforestation, and intensive agriculture have heightened atmospheric greenhouse gases like carbon dioxide (CO₂) and methane (CH₄), trapping infrared heat and warming Earth's surface by over 1.1°C.

Key global impacts include:
• Glacial Melting & Sea Level Rise: Polar ice sheets are shrinking, causing sea levels to rise and threatening coastal communities.
• Extreme Weather: Increasing frequency and severity of heatwaves, mega-droughts, floods, and super-storms.
• Ecological Disruptions: Widespread coral reef bleaching and species displacement due to rapid thermal changes.
• Socio-Economic Strain: Agricultural yield declines, freshwater stress, and growing climate displacement.

Combatting climate change requires global cooperation under treaties like the Paris Agreement, focusing on renewable energy transition, reforestation, energy efficiency, and carbon reduction technologies.`
      }
    ]
  }
];

const Assignments = () => {
  const [openAssignmentId, setOpenAssignmentId] = useState<number | null>(1);
  const [expandedAnswerId, setExpandedAnswerId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleAssignment = (id: number) => {
    setOpenAssignmentId((prev) => (prev === id ? null : id));
  };

  const toggleAnswer = (key: string) => {
    setExpandedAnswerId((prev) => (prev === key ? null : key));
  };

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(key);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = (assignment: Assignment) => {
    const text = `${assignment.title}\n\n` + 
      assignment.questions.map((q) => `Q${q.id}) ${q.question}\n\nAnswer:\n${q.answer}\n`).join('\n----------------------------------------\n\n');
    navigator.clipboard.writeText(text);
    setCopiedId(`all-${assignment.id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-4xl px-4 flex flex-col gap-8"
    >
      <div className="text-center space-y-4">
        <KineticHeading as="h1" text="Assignments" className="text-4xl text-ink font-heading" glowSweep />
        <p className="text-ink-light max-w-lg mx-auto">
          Access your EVS course assignments, question lists, and concise 200-word model answers.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {ASSIGNMENTS_DATA.map((assignment) => {
          const isOpen = openAssignmentId === assignment.id;
          return (
            <motion.div
              key={assignment.id}
              initial={false}
              className="rounded-2xl bg-surface/70 backdrop-blur-md border border-border overflow-hidden shadow-sm hover:border-accent/30 transition-all duration-300"
            >
              {/* Header Accordion Bar */}
              <button
                onClick={() => toggleAssignment(assignment.id)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none group hover:bg-card-border/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:scale-105 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-heading font-semibold text-ink group-hover:text-accent transition-colors">
                        {assignment.title}
                      </h2>
                      <span className="px-2.5 py-0.5 text-xs font-medium bg-accent/15 text-accent rounded-full border border-accent/20">
                        {assignment.questions.length} Questions + ~200-Word Answers
                      </span>
                    </div>
                    <p className="text-sm text-ink-light mt-0.5">{assignment.subtitle}</p>
                  </div>
                </div>

                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-9 h-9 rounded-full bg-card flex items-center justify-center text-ink-light group-hover:text-ink transition-colors"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </button>

              {/* Collapsible Questions & Answers List */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                  >
                    <div className="px-6 pb-6 pt-2 border-t border-border/50">
                      <div className="flex items-center justify-between my-4">
                        <div className="flex items-center gap-2 text-xs font-medium text-ink-light uppercase tracking-wider">
                          <HelpCircle className="w-4 h-4 text-accent" />
                          <span>Questions & ~200-Word Answers</span>
                        </div>

                        <button
                          onClick={() => handleCopyAll(assignment)}
                          className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-lg bg-card border border-border text-ink hover:bg-card-border transition-colors shadow-sm"
                        >
                          {copiedId === `all-${assignment.id}` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-emerald-500 font-semibold">Copied All Questions & Answers</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-accent" />
                              <span>Copy All Q&As</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {assignment.questions.map((q) => {
                          const qKey = `${assignment.id}-${q.id}`;
                          const isAnswerOpen = expandedAnswerId === qKey;
                          const isCopiedQuestion = copiedId === `q-${qKey}`;
                          const isCopiedAnswer = copiedId === `a-${qKey}`;

                          return (
                            <motion.div
                              key={q.id}
                              className="flex flex-col rounded-xl bg-card/60 border border-border/80 hover:border-accent/40 transition-all overflow-hidden"
                            >
                              {/* Question Bar */}
                              <div className="p-4 flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3 flex-grow">
                                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent/10 text-accent font-semibold text-xs flex items-center justify-center mt-0.5">
                                    Q{q.id}
                                  </span>
                                  <div>
                                    <h3 className="text-ink font-semibold text-base pt-1 leading-relaxed">
                                      {q.question}
                                    </h3>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <button
                                    onClick={() => handleCopyText(`Q${q.id}) ${q.question}`, `q-${qKey}`)}
                                    title="Copy Question"
                                    className="p-2 rounded-lg text-ink-light hover:text-accent hover:bg-accent/10 transition-all"
                                  >
                                    {isCopiedQuestion ? (
                                      <Check className="w-4 h-4 text-emerald-500" />
                                    ) : (
                                      <Copy className="w-4 h-4" />
                                    )}
                                  </button>

                                  <button
                                    onClick={() => toggleAnswer(qKey)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                      isAnswerOpen
                                        ? 'bg-accent text-white shadow-glow'
                                        : 'bg-accent/10 text-accent hover:bg-accent/20'
                                    }`}
                                  >
                                    <BookOpenCheck className="w-3.5 h-3.5" />
                                    <span>{isAnswerOpen ? 'Hide Answer' : 'View Answer (~200 words)'}</span>
                                    {isAnswerOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                              </div>

                              {/* Expandable Model Answer Container */}
                              <AnimatePresence>
                                {isAnswerOpen && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="border-t border-border/60 bg-surface/40 p-5"
                                  >
                                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/40">
                                      <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider">
                                        <BookOpenCheck className="w-4 h-4 text-accent" />
                                        <span>Model Answer (~200 Words)</span>
                                      </div>

                                      <button
                                        onClick={() => handleCopyText(q.answer, `a-${qKey}`)}
                                        className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded bg-card border border-border text-ink hover:bg-card-border transition-colors"
                                      >
                                        {isCopiedAnswer ? (
                                          <>
                                            <Check className="w-3 h-3 text-emerald-500" />
                                            <span className="text-emerald-500 font-semibold">Answer Copied!</span>
                                          </>
                                        ) : (
                                          <>
                                            <Copy className="w-3 h-3 text-accent" />
                                            <span>Copy Answer</span>
                                          </>
                                        )}
                                      </button>
                                    </div>

                                    <div className="text-ink/90 text-sm leading-relaxed whitespace-pre-line space-y-2 font-normal">
                                      {q.answer}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Assignments;
