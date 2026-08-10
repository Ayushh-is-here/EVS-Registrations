export interface Question {
  id: number;
  question: string;
  answer: string;
}

export interface InternalAssignment {
  id: number;
  title: string;
  subtitle: string;
  questions: Question[];
}

export interface BoardAssignmentQuestion {
  id: number;
  question: string;
  answer: string;
}

export interface BoardAssignmentDivision {
  division: string;
  description: string;
  questions: BoardAssignmentQuestion[];
}

export const INTERNAL_ASSIGNMENTS: InternalAssignment[] = [
  {
    id: 1,
    title: 'EVS Assignment 1 – Human and Environment',
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
  },
  {
    id: 2,
    title: 'EVS Assignment 2 – Environmental Pollution',
    subtitle: 'Indigenous Knowledge, Sacred Rules, Health & Environmental Ethics (~180 words each)',
    questions: [
      {
        id: 1,
        question: 'Write info about Indigenous knowledge (like crop, plants etc)',
        answer: `Indigenous knowledge (IK) refers to the unique, traditional, local knowledge existing within and developed around the specific conditions of women and men indigenous to a particular geographic area. Inherited through generations, it encompasses deep insights into local ecosystems, seasonal cycles, native plant species, and agricultural practices.

In agriculture, indigenous communities cultivate climate-resilient crop varieties such as landraces of ragi, bajra, sorghum, and heirloom rice like Navara and Kala Namak, which naturally tolerate drought, pests, and local soil conditions without synthetic inputs. Indigenous botanical knowledge also identifies the medicinal properties of native plants—such as Neem for pest management and antiseptic treatment, Tulsi for respiratory health, Turmeric for anti-inflammatory healing, and Amla for immunity.

Seed preservation is another cornerstone, where seeds are stored in mud-plastered earthenware coated with ash and neem leaves to prevent insect infestation. Preserving indigenous knowledge is vital for food security, conserving agrobiodiversity, developing sustainable climate-adaptation strategies, and protecting traditional healthcare systems against commercial genetic homogenization.`
      },
      {
        id: 2,
        question: 'Write info about Indigenous community practices',
        answer: `Indigenous community practices are traditional, sustainable living methods rooted in ecological harmony and collective resource stewardship. Developed over centuries, these practices prioritize long-term environmental conservation over short-term resource exploitation.

A prime example is community-based water management, such as the construction of Johads (earthen check dams) in Rajasthan, Zabo systems in Nagaland, and Bamboo drip irrigation in Meghalaya, which efficiently capture rainwater and recharge subterranean aquifers without environmental degradation. In forestry, indigenous groups like the Warlis of Maharashtra practice sustainable resource harvesting, collecting only fallen deadwood and non-timber forest produce, ensuring natural forest regeneration.

Sacred Groves (Devrais) represent another key practice where communities designate forest patches as sacred domains, enforcing strict taboos against logging or hunting to preserve pristine biodiversity. Furthermore, coastal indigenous fishing communities observe seasonal fishing bans during fish breeding periods to maintain marine populations. These self-regulating social norms, collective decision-making, and eco-friendly lifestyles provide invaluable blueprints for modern sustainable resource management.`
      },
      {
        id: 3,
        question: 'Short note on Sacred Rules',
        answer: `Sacred rules are unwritten, traditional ecological laws and cultural taboos practiced by indigenous and rural communities to protect nature through spiritual reverence. Rooted in deep respect for the biosphere, these rules govern human interaction with natural resources, establishing boundaries that prevent over-exploitation.

Key aspects of sacred rules include declaring specific forest areas as sacred groves (such as Devrais in Maharashtra, Kavu in Kerala, and Orans in Rajasthan), where cutting trees, collecting wood, or harming animals is strictly forbidden by social decree. Sacred rules also extend to individual tree species like Peepal (Ficus religiosa), Banyan (Ficus benghalensis), and Khejri (Prosopis cineraria), which are worshipped and legally protected from felling due to their ecological and cultural importance.

Additionally, sacred rules dictate seasonal hunting and fishing bans during animal breeding cycles, ensuring wildlife population recovery. Water bodies like natural springs and sacred lakes (e.g., Khecheopalri Lake in Sikkim) are similarly guarded against human pollution. By blending spirituality with ecological preservation, sacred rules serve as effective, community-enforced conservation mechanisms.`
      },
      {
        id: 4,
        question: 'Info on threats to sacred rules in India',
        answer: `In India, traditional sacred rules and community-led conservation systems face severe threats due to rapid modern socio-economic transformations. Urbanization, industrial expansion, and large-scale infrastructure projects (such as highways, dams, and mining operations) frequently encroach upon and fragment sacred groves and pristine natural habitats, ignoring traditional community boundaries.

Modernization and shifting cultural values among younger generations have led to the gradual erosion of traditional belief systems, weakening respect for ancient taboos that historically protected sacred flora and fauna. Commercialization of natural resources, including illegal timber logging, poaching, and commercial agriculture, incentivizes short-term financial gains over long-term ecological protection.

Furthermore, the absence of formal legal recognition for sacred groves under government land records exposes them to land acquisition and conversion. Environmental pollution from tourism, plastic waste dumping, and soil contamination further degrades sacred water bodies and forest ecosystems. Protecting these sacred rules requires integrating indigenous conservation rights into formal environmental governance, promoting public awareness, and granting legal protection to community-managed sanctuaries.`
      },
      {
        id: 5,
        question: 'Co-relate the following:- a) Environment & health b) Water & health c) Air & health d) Soil & health',
        answer: `Human health is directly dependent on environmental quality across atmospheric, aquatic, and terrestrial systems:

a) Environment & Health: Ecosystem stability ensures vital services like climate regulation, oxygen production, and disease control. Environmental degradation disrupts ecological balance, increasing vector-borne diseases (malaria, dengue) and heat-induced health crises.
b) Water & Health: Clean water is essential for biological survival. Contaminated water carrying domestic sewage or industrial effluents causes fatal waterborne diseases like cholera, dysentery, and typhoid, while chemical pollutants like fluoride or heavy metals cause chronic toxicity.
c) Air & Health: Clean air supplies vital oxygen. Air polluted with fine particulate matter (PM2.5, PM10), sulfur dioxide, and nitrogen oxides causes severe respiratory ailments including asthma, chronic bronchitis, reduced lung capacity, and cardiovascular disorders.
d) Soil & Health: Healthy soil yields nutrient-rich food. Soil contaminated with agricultural pesticides, heavy metals, or industrial sludge transfers toxic residues into food crops, leading to bioaccumulation, digestive disorders, organ toxicity, and long-term carcinogenic health risks.

Protecting all four environmental domains is essential for maintaining holistic human health.`
      },
      {
        id: 6,
        question: 'Difference between Radioactive activity & health',
        answer: `Radioactivity and health represent a crucial relationship between nuclear physics and biological well-being. Radioactivity refers to the spontaneous breakdown of unstable atomic nuclei emitting ionizing radiation (alpha particles, beta particles, and gamma rays). Human health, in contrast, depends on cellular integrity and biochemical balance, which can be severely disrupted by exposure to radioactive materials.

Ionizing radiation penetrates biological tissues, causing ionization of molecules and water within cells. This generates free radicals that break chemical bonds and damage cellular DNA.

Key impacts of radioactive activity on health include:
• Acute Radiation Sickness (ARS): High-dose radiation exposure causes immediate tissue damage, severe nausea, internal hemorrhaging, hair loss, and bone marrow failure.
• Chronic Effects & Cancer: Low-dose long-term exposure or ingestion of radionuclides (such as Radium, Iodine-131, and Strontium-90) induces DNA mutations, leading to leukemia, thyroid cancer, and genetic birth defects in future generations.

While controlled natural background radiation and medical radiation (X-rays) are manageable, uncontrolled radioactive waste or nuclear fallouts pose catastrophic, irreversible risks to human health.`
      },
      {
        id: 7,
        question: 'Write info on Environmental Ethics ( about rights )',
        answer: `Environmental ethics is a branch of environmental philosophy that considers the moral obligations of human beings toward the natural environment and non-human entities. Unlike traditional anthropocentric (human-centered) ethics, which views nature solely as a resource for human consumption, environmental ethics advocates for biocentrism and ecocentrism. It asserts that all living organisms—including plants, animals, forests, and entire ecosystems—possess intrinsic value and inherent rights to exist and thrive, independent of their economic utility to humans.

Key concepts regarding rights in environmental ethics include:
1. Rights of Nature: Granting legal and moral rights to natural entities such as rivers, forests, and wild species to be protected from destruction.
2. Intergenerational Equity: Recognizing the right of future human generations to inherit a healthy, biodiverse, and unpolluted planet.
3. Animal Rights & Earth Stewardship: Extending moral consideration to animals, rejecting animal cruelty, and placing a moral duty on humans to act as responsible stewards rather than dominators of Earth's biosphere.`
      },
      {
        id: 8,
        question: 'Short note on Right to live',
        answer: `The "Right to Live" is a fundamental human right enshrined in Article 21 of the Constitution of India, which guarantees that "No person shall be deprived of his life or personal liberty except according to procedure established by law." Through progressive judicial interpretation, the Supreme Court of India has significantly expanded the scope of Article 21 to mean more than mere animal existence; it encompasses living a life with human dignity, safety, and health.

In landmark environmental judgments (such as Subhash Kumar v. State of Bihar, 1991), the judiciary explicitly recognized that the Right to Life includes the "Right to enjoy pollution-free water and air" and a healthy, ecologically balanced environment. Without clean air to breathe, safe drinking water, and uncontaminated food, human life cannot be sustained with dignity.

Consequently, the Right to Live imposes a legal and moral obligation on the state to control environmental pollution, enforce strict ecological laws, and safeguard citizens from industrial hazards and ecological degradation.`
      },
      {
        id: 9,
        question: 'Short on Human rights & environment',
        answer: `Human rights and the environment are intrinsically linked; a clean, healthy, and sustainable environment is a fundamental prerequisite for the full enjoyment of basic human rights. Basic human rights—such as the right to life, health, food, safe drinking water, adequate housing, and culture—cannot be realized in a degraded or polluted environment. Conversely, environmental degradation, climate change, deforestation, and industrial pollution directly violate human rights by displacing communities, causing fatal illnesses, and destroying livelihoods.

In 2021, the United Nations Human Rights Council formally recognized access to a clean, healthy, and sustainable environment as a universal human right. This framework emphasizes environmental justice, asserting that vulnerable populations and indigenous communities should not bear a disproportionate burden of environmental harm caused by industrial activities.

Protecting the environment is therefore essential for enforcing human rights, requiring transparent environmental decision-making, access to ecological information, public participation, and legal accountability for environmental violations.`
      },
      {
        id: 10,
        question: 'What is the importance of value education in your life?',
        answer: `Value education is the process of imparting moral values, ethical principles, empathy, and social responsibility to individuals, serving as the foundation for personal character and conscious citizenship. In modern society, where technological progress often outpaces ethical responsibility, value education plays a vital role in guiding human choices toward harmony, environmental stewardship, and social justice.

Key benefits of value education in personal life include:
1. Moral & Character Development: Fosters integrity, honesty, self-discipline, and respect for diversity, helping individuals make ethical decisions when facing complex life challenges.
2. Environmental Consciousness: Instills a deep respect for nature, encouraging eco-friendly habits such as resource conservation, waste reduction, and sustainable living rather than mindless consumerism.
3. Social Empathy & Harmony: Promotes compassion, peaceful conflict resolution, and civic responsibility, strengthening relationships within families and communities.

By integrating ethical values with academic knowledge, value education shapes individuals into responsible, empathetic, and environmentally conscious global citizens committed to building a sustainable and equitable world.`
      }
    ]
  },
  {
    id: 3,
    title: 'Assignment 3 – Sustainable Development',
    subtitle: 'Chapter 3: Sustainable Development Balances, SDGs & Organic Farming (~150 words each)',
    questions: [
      {
        id: 1,
        question: 'Define sustainable development and explain its aim with respect to balancing economic, environmental, and social needs.',
        answer: `Sustainable development is defined as "the development that fulfils the needs of the present without compromising the ability of future generations to meet their own needs." It recognizes that human progress must not come at the cost of depleting natural resources or damaging ecosystems that future generations will depend upon.

The aim is to strike a balance between three pillars: economic growth, environmental protection, and social equity. Economically, it seeks true growth reflected in equitable distribution of benefits, bridging the gap between rich and poor. Environmentally, it emphasizes conserving natural resources like forests, water, and soil so ecological processes continue smoothly, since the environment acts as both a source of raw materials and a sink for waste. Socially, it ensures basic needs like food, health, and education are met for all. Sustainable development thus integrates growth with responsibility toward nature and future generations.`
      },
      {
        id: 2,
        question: 'List any five Sustainable Development Goals (SDGs) and briefly explain what each aims to achieve.',
        answer: `The 17 SDGs were set by the UN General Assembly in 2015, to be achieved by 2030, as a blueprint for a better and sustainable future. Five examples are:

• Goal 1 (No Poverty) – aims to end poverty in all forms everywhere.
• Goal 3 (Good Health) – ensures healthy lives and promotes well-being for all ages.
• Goal 6 (Clean Water and Sanitation) – ensures availability and sustainable management of water and sanitation for all.
• Goal 7 (Renewable Energy) – ensures access to affordable, reliable, and modern energy for all.
• Goal 13 (Climate Action) – calls for urgent action to combat climate change and its impacts.

Together, these goals address interconnected global challenges—poverty, hunger, health, education, gender equality, water, energy, economic growth, industry, inequality, sustainable cities, responsible consumption, climate, life below water and on land, peace, and global partnerships—forming a comprehensive framework for sustainable global development.`
      },
      {
        id: 3,
        question: 'What are the major challenges faced in achieving sustainable development? Explain any three in detail.',
        answer: `Several challenges hinder sustainable development.

Population growth puts continuous pressure on limited natural resources, as the world's population (over 7.7 billion) exploits resources faster than they can regenerate.

Exploitation of natural resources such as timber, coal, minerals, oil, and water has increased since industrialization, driven by new technologies and changing lifestyles, leading to depletion.

Unequal distribution of resources is another major issue—developed countries like the USA, with only 4% of world population, consume about 25% of global resources, while developing nations struggle with basic needs.

Additional challenges include poverty, consumerism (increased purchasing power leading to excessive consumption), illiteracy and unemployment, lack of public awareness about resource limits, and weak government policy implementation. Addressing these requires coordinated efforts—responsible consumption, equitable resource sharing, strong environmental policies, and public education—to ensure development does not compromise ecological balance or future generations' needs.`
      },
      {
        id: 4,
        question: 'Explain the concept of organic farming. Describe any three elements of sustainable agriculture (e.g., mixed cropping, crop rotation, bio-fertilizers).',
        answer: `Organic farming is a farming system that avoids chemical fertilizers, pesticides, and synthetic feed additives, relying instead on natural and traditional methods combined with modern knowledge. It is based on the principle that nature is the best model for farming and that soil is a living system that should not be used for dumping chemicals.

Three key elements of sustainable agriculture are:
• Mixed cropping – growing different crops together in the same field so they benefit each other, e.g., planting Tur between cotton rows to fix atmospheric nitrogen, reducing pest risk and improving soil fertility.
• Crop rotation – growing different crops sequentially in the same space to maintain nutrient balance, improve soil structure, and inhibit pest growth.
• Bio-fertilizers – living organisms like Rhizobium and Azotobacter that enrich soil nutrients naturally, improving soil texture without causing pollution, making farming eco-friendly and cost-effective.`
      },
      {
        id: 5,
        question: 'Describe the role of individuals, community, and government in promoting sustainable development, giving one example of each.',
        answer: `At the individual level, people can practice sustainable development by carefully using resources like food, water, energy, and paper, following the '4R' principle—Reduce, Reuse, Recycle, Recover—in daily life, such as reducing plastic use and conserving water and electricity.

At the community level, collective action inspired by leadership can transform an entire village; Ralegan Siddhi, led by Anna Hazare, is a promising example where community participation in watershed management, tree plantation, and water conservation led to prosperity and sustainability.

At the government level, policies and schemes drive large-scale change; for example, Swachh Bharat Abhiyan, launched in 2014, aims to provide sanitation facilities, build toilets, and establish waste disposal systems nationwide, addressing SDG Goal 6. Together, these three levels—individual responsibility, community cooperation, and government policy—create a multi-tiered approach essential for achieving genuine and lasting sustainable development.`
      }
    ]
  },
  {
    id: 4,
    title: 'Assignment 4 – Practices for Environmental Protection',
    subtitle: 'Chapter 4: Eco-Labelling, EIA, Green Audit & International Conventions (~150 words each)',
    questions: [
      {
        id: 1,
        question: 'What is consumer education? Explain its need and importance with reference to the Consumer Protection Act, 1986.',
        answer: `Consumer education is defined as imparting knowledge to a consumer regarding cost effectiveness, budgeting ability, and developing awareness of purchase. With rising consumerism and purchasing power, substandard and even harmful products are increasingly sold at high prices, making consumer education essential. It provides skills to select the right goods from a huge range, helps consumers assess the market, reduces cheating on quantity and quality, promotes ethical values, and encourages sustainable consumption of eco-friendly products.

The Consumer Protection Act, 1986, passed by the Indian Parliament, legally safeguards these interests by granting consumers several rights: protection from hazardous goods and services, the right to be informed about quantity and performance of goods, right to free choice at competitive prices, right to be heard in decisions affecting consumer interest, right to redressal if rights are violated, and the right to consumer education itself.`
      },
      {
        id: 2,
        question: 'What is eco-labelling? Explain the criteria and importance of the ECO Mark scheme in India.',
        answer: `Eco-labelling is the use of labels on products to indicate how environment-friendly they are, helping consumers make informed purchasing decisions and encouraging sustainable consumption.

The ECO Mark scheme, launched by the Government of India in 1991, certifies products that are made, used, and disposed of in a manner that significantly reduces environmental harm—following a "cradle-to-grave" approach covering raw material sourcing, energy-efficient production, waste management, and biodegradability. Requirements for ECO Mark include meeting Bureau of Indian Standards (BIS) norms, displaying critical ingredients in descending order of quantity, showing eco-friendly labelling criteria on packaging, and using reusable/recyclable/biodegradable packaging material.

It has been notified for 16 product categories including soaps, detergents, paper, food items, paints, batteries, and cosmetics. The scheme's logo, an earthen pot, symbolizes sustainability since it uses renewable resources, produces no hazardous waste, and consumes minimal energy—promoting consumer awareness and industry accountability.`
      },
      {
        id: 3,
        question: 'Explain the concept and objectives of Environmental Impact Assessment (EIA). Describe the categories of projects under the EIA notification.',
        answer: `Environmental Impact Assessment (EIA) is a systematic process to identify, predict, and evaluate the environmental effects of a proposed project before it is implemented. Its objectives include identifying economic, environmental, and social impacts of development; providing information for decision-making; identifying alternatives and mitigation measures; promoting resource conservation and waste minimization; and ultimately promoting sustainable development.

In India, EIA has been mandatory since 1994, and under the 2006 notification, it applies to 40 specified activities across sectors like industry, mining, irrigation, power, and transport, managed by the Ministry of Environment, Forest and Climate Change (MoEF&CC).

Projects are classified into two categories:
• Category A: large projects such as ports, highways, and urban transport with greater environmental impact, cleared by the central government's Expert Appraisal Committee (EAC).
• Category B: smaller projects with lesser impact, assessed at the state level by the State Expert Appraisal Committee (SEAC).`
      },
      {
        id: 4,
        question: 'What is Green Audit? Explain its components (waste audit, water audit, energy audit, ecological audit) and their significance.',
        answer: `Green Audit is a systematic process of identifying, quantifying, recording, and analyzing an organization's use of resources like energy, water, built-up space, and air quality, aiming to upgrade environmental conditions and reduce risks to human health. It has four key components:

• Waste audit – determines the type and volume of waste generated, guiding recycling, composting, and reduction strategies to achieve a 'zero waste' campus.
• Water audit – evaluates water intake, wastewater treatment, and harvesting facilities to balance demand and supply.
• Energy audit – examines energy consumption patterns to identify wastage and suggest conservation techniques, helping combat global warming.
• Ecological audit – assesses land use, green cover percentage, and biodiversity, checking pesticide use and eco-friendly initiatives.

Together, these audits help organizations frame better environmental performance, prepare resource inventories, implement conservation measures, and demonstrate environmental responsibility through continuous feedback and improvement.`
      },
      {
        id: 5,
        question: 'Discuss any two international conventions/agreements related to environmental protection (e.g., Ramsar Convention, Stockholm Conference, Rio Earth Summit) and India\'s role in them.',
        answer: `The Ramsar Convention (1971) is an intergovernmental treaty for conservation and wise use of wetlands, addressing not only preservation but sustainable use. India joined in 1982 and now has numerous Ramsar sites of international importance, selected based on criteria like supporting endangered species or large populations of water birds.

The Stockholm Conference (1972) was the first major international conference on environmental problems, producing the "Framework for Environmental Action" with 109 recommendations. India, as a signatory, played an important role—Prime Minister Indira Gandhi highlighted the link between poverty and environment.

Following this, India added Articles 48A and 51A(g) to the Constitution through the 42nd Amendment, making environmental protection a state obligation and citizen's duty, and later enacted the Water Act (1974), Air Act (1981), and Environment Protection Act (1986), establishing a strong legal framework for environmental governance.`
      }
    ]
  },
  {
    id: 5,
    title: 'Assignment 5 – Water Security',
    subtitle: 'Chapter 5: Water Resources, Scarcity, Pollution & National Water Policy (~150 words each)',
    questions: [
      {
        id: 1,
        question: 'Explain the sources of water resources in India (surface water and groundwater) and the factors affecting groundwater availability.',
        answer: `India's water resources are broadly classified into surface water and groundwater.

Surface water sources include rivers, lakes, ponds, and tanks, with rivers being the most important; Ganga and Brahmaputra have the largest catchment areas. However, due to topographical and hydrological constraints, only about 32% of available surface water can actually be utilized, and rainfall is highly uneven, concentrated mainly in the monsoon season.

Groundwater is rainwater that percolates into the ground and represents a crucial water source in India. Its availability depends on topography, subsurface geology, and prevailing climate. Groundwater utilization is very high in states like Punjab, Haryana, Rajasthan, and Tamil Nadu, while states like Chhattisgarh, Odisha, and Kerala use only a small proportion of their potential. The Central Ground Water Authority (CGWA) regulates industrial groundwater usage to prevent over-exploitation and ensure sustainable management of this vital resource.`
      },
      {
        id: 2,
        question: 'What is water scarcity? Discuss the causes of water scarcity in India with suitable examples.',
        answer: `Water scarcity refers to the shortage or inadequate availability of usable water to meet demand. Despite India receiving nearly 4% of global precipitation, it faces acute water scarcity due to several causes.

Rainfall is highly uneven—Konkan receives over 300 cm annually while eastern Maharashtra districts like Sangli, Solapur, and Marathwada receive only about 50 cm, causing regional imbalance. Over-exploitation and excessive use of groundwater, particularly for irrigation and industry, deplete resources faster than they can recharge. Rapid industrialization and urbanization increase pressure on existing water sources, while pollution from domestic and industrial waste renders large quantities of water unfit for use, effectively reducing usable supply.

Additionally, poor water management, wastage, and lack of conservation practices worsen the crisis. By 2025, over 50 countries including India are predicted to face severe water scarcity, making conservation and efficient management urgent priorities.`
      },
      {
        id: 3,
        question: 'Explain the major sources of water pollution and their harmful effects on human health and aquatic ecosystems.',
        answer: `Water pollution arises from four major sources.

Domestic waste (sewage) includes human and animal excreta, detergents, and food waste that accumulate in water bodies, causing eutrophication, foul odor, and spreading diseases like cholera and typhoid.

Industrial waste from textile, chemical, and leather industries releases heavy metals and toxic compounds like phenol and cyanide, which are non-degradable and carcinogenic.

Agricultural waste, including excess fertilizers and pesticides, leaches into groundwater and surface water through runoff, harming aquatic life and human health.

Thermal pollution, from power plants discharging heated water, reduces dissolved oxygen and disrupts aquatic ecosystems, even affecting sex determination in species like sea turtles. Collectively, these pollutants cause eutrophication, oxygen depletion, fish kills, bioaccumulation of toxins in the food chain, and serious human diseases.`
      },
      {
        id: 4,
        question: 'Describe any three traditional and modern water conservation and watershed management techniques (e.g., check dams, contour trenches, rainwater harvesting).',
        answer: `Water conservation combines traditional wisdom with modern engineering.

Check dams are small dams built across waterways using stone, sandbags, or branches to reduce water flow velocity and increase groundwater percolation.

Contour trenches are dug along hillsides following contour lines, perpendicular to water flow, to capture and hold rainfall, preventing runoff and soil erosion.

Rainwater harvesting involves collecting rooftop rainwater and channeling it into percolation chambers to recharge groundwater; for example, a 100 sq. m terrace in Pune with 760 mm average rainfall can harvest about 76,000 liters annually.

Other techniques include traditional systems like Johads (earthen dams) in Rajasthan and Kunds (underground tanks), alongside modern methods like gabion structures and farm ponds. Together, these methods conserve water, recharge aquifers, and support sustainable agriculture and drinking water supply.`
      },
      {
        id: 5,
        question: 'Explain the highlights of India\'s National Water Policy, 2002, and its importance in water conservation.',
        answer: `India's National Water Policy, 2002, aims to provide surplus water to deficit areas while reducing pollution and improving river water quality.

Key highlights include mandating that irrigation and multipurpose projects include a drinking water component wherever no alternative source exists, ensuring drinking water availability for all humans and animals, and regulating groundwater exploitation to prevent over-extraction. The policy emphasizes regular monitoring of both surface and groundwater quality, with dedicated programs for improving water quality where needed.

It also calls for improving efficiency in all water uses—agricultural, domestic, and industrial—and fostering awareness that water is a scarce resource requiring conservation consciousness from an early educational stage, supported by regulations, incentives, and disincentives. This policy provides a national framework guiding states toward sustainable water management and long-term water security.`
      }
    ]
  }
];

export const BOARD_ASSIGNMENTS: BoardAssignmentDivision[] = [
  {
    division: 'Division A',
    description: 'Journal Questions covering Chapters 1–5.',
    questions: [
      {
        id: 1,
        question: 'Explain population growth and demographic transition with the help of population pyramids.',
        answer: `Population growth refers to the change in human population over time, driven by birth rates, death rates, and migration. To analyze demographic shifts, social scientists use the Demographic Transition Model (DTM) alongside population pyramids—graphical illustrations showing the distribution of various age groups and genders in a population.

Population pyramids visually represent the four main stages of demographic transition:
1. Expanding (Stage 1 & 2): A broad base with steep sloping sides indicates high birth rates alongside high child mortality. This pyramid shape is typical of pre-industrial or developing societies experiencing early growth.
2. Stationary (Stage 3): A pyramid with a narrower base and broader middle age bracket reflects declining birth rates and lower death rates due to improved healthcare, indicating population stabilization.
3. Contracting (Stage 4 & 5): A top-heavy structure with a narrow base signifies low birth rates and an aging population, as seen in highly developed nations.

Analyzing population pyramids helps governments predict future workforce availability, plan pension systems, build schools, and address challenges related to aging demographics or youthful population booms.`
      },
      {
        id: 2,
        question: 'Describe the causes and control measures of noise pollution and air pollution.',
        answer: `Air and noise pollution are major environmental hazards arising primarily from rapid industrialization, urban growth, and modern transportation systems.

Air Pollution:
• Causes: Combustion of fossil fuels in vehicles, industrial emissions of sulfur dioxide (SO₂) and nitrogen oxides (NOₓ), agricultural burning of stubble, and thermal power generation releasing particulate matter (PM2.5 and PM10).
• Control Measures: Enforcing strict emission standards (such as Bharat Stage VI norms), transitioning to renewable energy (solar, wind, electric vehicles), installing industrial scrubbers and electrostatic precipitators, and expanding urban green belts.

Noise Pollution:
• Causes: Heavy vehicular traffic, construction machinery, aircraft, factory generators, and unmonitored use of loudspeakers during public events.
• Control Measures: Declaring silent zones near hospitals and schools, installing soundproof barriers along highways and industrial plants, setting legal decibel limits, enforcing strict curfews on loud events, and promoting green buffers with leafy trees that absorb sound vibrations.`
      },
      {
        id: 3,
        question: 'What are the Sustainable Development Goals? Explain any five in detail.',
        answer: `The Sustainable Development Goals (SDGs) are a collection of 17 interlinked global goals adopted by the United Nations in 2015 as a universal call to action to end poverty, protect the planet, and ensure peace and prosperity by 2030.

Five key SDGs in detail:
1. SDG 6 (Clean Water and Sanitation): Focuses on ensuring universal access to safe and affordable drinking water, improving sanitation facilities, reducing water pollution, and protecting water-related ecosystems.
2. SDG 7 (Affordable and Clean Energy): Aims to ensure access to reliable, sustainable, and modern energy by expanding solar, wind, and hydroelectric infrastructure while improving energy efficiency.
3. SDG 13 (Climate Action): Calls for urgent action to combat climate change, integrate climate measures into national policies, and strengthen resilience against climate-related natural disasters.
4. SDG 14 (Life Below Water): Strives to conserve and sustainably manage oceans, seas, and marine resources by preventing marine pollution, reducing ocean acidification, and ending overfishing.
5. SDG 15 (Life on Land): Focuses on protecting terrestrial ecosystems, combating desertification, halting soil degradation, and preserving global biodiversity and forests.`
      },
      {
        id: 4,
        question: 'Explain the concept and importance of Environmental Impact Assessment (EIA) in India.',
        answer: `Environmental Impact Assessment (EIA) is a systematic procedure used to evaluate the potential environmental consequences of proposed infrastructure, industrial, or developmental projects prior to execution. In India, EIA was formally introduced under the Environment (Protection) Act, 1986, to integrate ecological considerations into economic planning.

Process of EIA in India:
The EIA process includes Screening (determining project scope), Scoping (identifying key environmental concerns), Baseline Data Collection, Impact Assessment, Public Consultation (engaging local communities), and Decision Making (granting or denying Environmental Clearance).

Importance of EIA:
1. Sustainable Development: Prevents irreversible ecological damage by evaluating project alternatives before construction begins.
2. Pollution Mitigation: Recommends mandatory mitigation strategies, such as effluent treatment plants and green belt development.
3. Democratic Participation: Provides a public hearing platform for local communities and indigenous groups affected by land acquisition or resource extraction.
4. Legal Enforcement: Enables government bodies like the Ministry of Environment, Forest and Climate Change (MoEFCC) to monitor compliance through Environment Management Plans (EMP).`
      },
      {
        id: 5,
        question: 'Discuss the traditional and modern water conservation and watershed management techniques used in India.',
        answer: `Water conservation and watershed management are vital for India due to monsoon dependence and seasonal water scarcity. Combining traditional wisdom with modern technology offers sustainable solutions.

Traditional Techniques:
• Johads & Kunds: Rainwater storage structures in arid states like Rajasthan that capture surface runoff to recharge underground aquifers.
• Baolis (Stepwells): Multi-story subterranean wells engineered to store water while minimizing evaporative loss.
• Bandharas & Kuhls: Traditional check dams and diversion channels built in Maharashtra and Himachal Pradesh to direct stream water to agricultural fields.

Modern Techniques:
• Rooftop Rainwater Harvesting: Directing rainwater from roofs into subterranean filtration pits and recharge wells in urban buildings.
• Watershed Management Structures: Constructing contour trenches, check dams, and gabion structures across hilly slopes to reduce soil erosion and slow down surface runoff.
• Precision Drip & Micro-Sprinkler Irrigation: Delivering water directly to plant roots, cutting agricultural water loss by up to 60% compared to traditional flood irrigation.`
      }
    ]
  },
  {
    division: 'Division B',
    description: 'Journal Questions covering Chapters 1–5.',
    questions: [
      {
        id: 1,
        question: 'Explain the role of indigenous communities (e.g., Warlis) in environmental conservation, and describe the concept of sacred groves.',
        answer: `Indigenous communities across the globe possess rich Traditional Ecological Knowledge (TEK) developed over centuries of close co-existence with nature. In India, tribes such as the Warli of Maharashtra demonstrate a deep reverence for natural ecosystems.

Role of Warlis & Indigenous Tribes:
The Warlis honor nature through their famous Warli art, which depicts mother nature (Palghat), flora, fauna, and sustainable living routines. They practice sustainable resource harvesting, collecting only dry firewood and non-timber forest produce while actively protecting forests against deforestation.

Sacred Groves:
Sacred Groves (known as Devrai in Maharashtra, Kavu in Kerala, and Orans in Rajasthan) are virgin forest patches protected by local indigenous communities through religious customs and cultural taboos.
• Ecological Significance: Sacred groves act as biodiversity sanctuaries protecting endangered flora, medicinal herbs, and rare fauna.
• Microclimate & Water Conservation: They maintain soil moisture, act as groundwater recharge zones, and reduce local soil erosion.
• Conservation Model: They represent one of the oldest community-led conservation systems without formal government enforcement.`
      },
      {
        id: 2,
        question: 'What is global warming and the greenhouse effect? Explain the impacts of climate change.',
        answer: `Global warming and the greenhouse effect are key phenomena shaping contemporary climate science and environmental policy.

The Greenhouse Effect & Global Warming:
The natural greenhouse effect is a process where gases like Carbon Dioxide (CO₂), Methane (CH₄), Nitrous Oxide (N₂O), and Water Vapor trap heat radiated from Earth's surface, keeping the planet warm enough to sustain life. However, human activities like fossil fuel burning, deforestation, and industrial agriculture have exponentially increased greenhouse gas concentrations, resulting in enhanced global warming—the rapid rise in Earth's average surface temperature.

Impacts of Climate Change:
1. Melting Glaciers & Sea Level Rise: Thermal expansion of oceans and polar ice sheet loss threaten coastal cities with flooding and saltwater intrusion into freshwater aquifers.
2. Extreme Weather Events: Heightened frequency and intensity of heatwaves, mega-droughts, unseasonal rain, and severe tropical cyclones.
3. Biodiversity Loss: Thermal shifts force species migration, trigger coral reef bleaching, and disrupt seasonal ecological food webs.
4. Food & Water Insecurity: Disrupted monsoon patterns and droughts reduce crop productivity, exacerbating global hunger.`
      },
      {
        id: 3,
        question: 'Explain organic farming and its principles, along with the elements of sustainable agriculture (mixed cropping, crop rotation, biofertilizers).',
        answer: `Organic farming is a holistic agricultural management system that promotes agro-ecosystem health, soil biodiversity, and biological cycles by completely avoiding synthetic chemical fertilizers, pesticides, and genetically modified organisms (GMOs).

Principles of Organic Farming:
1. Health: Sustaining and enhancing the health of soil, plants, animals, humans, and the planet.
2. Ecology: Working with, emulating, and sustaining living ecological systems and cycles.
3. Fairness: Ensuring equity and environmental stewardship for farmers and farm workers.

Key Elements of Sustainable Agriculture:
• Crop Rotation: Alternating different crop families in successive seasons on the same land to disrupt pest life cycles and replenish soil nutrients naturally.
• Mixed Cropping: Growing two or more crops simultaneously on the same plot (e.g., wheat and chickpea) to minimize crop failure risk and maximize soil space.
• Biofertilizers: Utilizing living microorganisms like Rhizobium, Azotobacter, and Blue-Green Algae (BGA) to fix atmospheric nitrogen and solubilize phosphorus naturally in the soil.`
      },
      {
        id: 4,
        question: 'What is Green Audit? Explain its types (waste, water, energy, ecological audit) and benefits.',
        answer: `A Green Audit is an official, systematic examination of an organization's, educational institution's, or industry's environmental practices, resource usage, and carbon footprint to ensure compliance with environmental regulations and sustainability goals.

Types of Green Audit:
1. Energy Audit: Analyzes energy consumption patterns, identifies power wastage, and recommends energy-efficient lighting, solar power adoption, and smart HVAC usage.
2. Water Audit: Evaluates total water inflow, consumption across facilities, leakage points, and the feasibility of rainwater harvesting and greywater recycling.
3. Waste Audit: Examines the generation, segregation, recycling, and disposal practices of hazardous, electronic, and municipal solid waste.
4. Ecological Audit: Measures campus biodiversity, canopy cover, tree counts, and land usage to assess ecological balance.

Benefits of Green Audit:
• Cost Reduction: Lowers operational expenses through energy and water conservation.
• Regulatory Compliance: Ensures adherence to statutory environmental standards.
• Sustainability Culture: Fosters environmental responsibility among students, employees, and management.`
      },
      {
        id: 5,
        question: 'Explain the causes and effects of water pollution, with reference to domestic, industrial, and agricultural sources.',
        answer: `Water pollution occurs when harmful chemical, physical, or biological substances contaminate streams, rivers, lakes, oceans, and groundwater supplies, rendering them unsafe for human use and aquatic ecosystems.

Major Sources & Causes:
1. Domestic Wastewater: Untreated municipal sewage containing pathogens, detergents, organic matter, and household chemicals discharged directly into water bodies.
2. Industrial Effluents: Discharge of untreated toxic heavy metals (mercury, lead, cadmium), acids, dyes, and thermal discharges from factories, refineries, and textile mills.
3. Agricultural Runoff: Excessive synthetic fertilizers (nitrates, phosphates) and chemical pesticides washed off farm fields during rain into nearby streams.

Effects of Water Pollution:
• Eutrophication: Excess agricultural runoff causes massive algal blooms, depleting dissolved oxygen levels and causing large-scale fish kills (hypoxia).
• Waterborne Diseases: Sewage contamination spreads pathogens causing cholera, typhoid, dysentery, and hepatitis.
• Bioaccumulation & Biomagnification: Toxic heavy metals build up in aquatic organisms and concentrate up the food chain, posing severe health risks to humans.`
      }
    ]
  },
  {
    division: 'Division C',
    description: 'Journal Questions covering Chapters 1–5.',
    questions: [
      {
        id: 1,
        question: 'Describe the environmental problems associated with urban and rural settlements.',
        answer: `Human settlements, whether urban or rural, interact directly with natural ecosystems, giving rise to distinct environmental issues based on population density and resource consumption.

Environmental Problems in Urban Settlements:
1. Air & Noise Pollution: High vehicle density and industrial activity release toxic emissions (PM2.5, NOₓ) and create constant noise pollution.
2. Solid Waste Accumulation: Massive daily generation of unsegregated plastic, e-waste, and municipal refuse leading to overflowing landfills and toxic leachate.
3. Urban Heat Island (UHI) Effect: Concrete structures and asphalt roads absorb heat, making urban centers significantly warmer than surrounding rural regions.
4. Slum Proliferation: Overcrowding leads to inadequate sanitation, open drainage, and severe water scarcity.

Environmental Problems in Rural Settlements:
1. Deforestation & Soil Degradation: Over-reliance on fuelwood and overgrazing lead to soil erosion and loss of green cover.
2. Improper Sanitation: Open defecation and lack of proper sewage management contaminate groundwater aquifers.
3. Agro-Chemical Hazards: Unregulated pesticide spray harms rural air quality, soil fertility, and agricultural workers' health.`
      },
      {
        id: 2,
        question: 'Explain the classification and management (4R principle) of solid waste.',
        answer: `Solid waste refers to any non-liquid trash generated from residential, commercial, institutional, and industrial activities. Proper management is essential to prevent soil degradation, groundwater contamination, and public health hazards.

Classification of Solid Waste:
1. Biodegradable Waste: Food scraps, organic kitchen waste, yard waste, and paper that decompose naturally.
2. Non-Biodegradable Waste: Plastics, metals, glass, and synthetic materials that persist in the environment for decades.
3. Hazardous & E-Waste: Batteries, paints, electronics, medical waste, and chemicals requiring specialized handling.

The 4R Principle for Waste Management:
• Reduce: Lowering waste generation at the source by avoiding single-use items, excessive packaging, and disposable products.
• Reuse: Extending product lifespans by repairing, repurposing, and sharing items instead of discarding them.
• Recycle: Processing discarded materials (glass, aluminum, paper, plastics) into raw materials for manufacturing new goods.
• Recover: Extracting energy or resources from non-recyclable waste through composting, biogas generation, or waste-to-energy incineration.`
      },
      {
        id: 3,
        question: 'What are the major challenges to achieving sustainable development?',
        answer: `Sustainable development aims to meet the needs of the present without compromising the ability of future generations to meet their own needs. However, global implementation faces severe structural challenges.

Major Challenges:
1. Overpopulation & Rapid Urbanization: Escalating population growth inflates demand for food, energy, housing, and freshwater, straining fragile natural ecosystems.
2. Over-dependence on Fossil Fuels: Industrial economies remain tied to coal, oil, and gas, making the rapid transition to renewable energy economically and politically complex.
3. Poverty & Inequality: Developing nations often prioritize immediate economic growth over long-term environmental protection to lift millions out of poverty.
4. Climate Change & Biodiversity Loss: Accelerated deforestation, habitat destruction, and extreme weather events erode planetary ecological buffers.
5. Ineffective Policy Implementation: Weak regulatory enforcement, lack of green infrastructure financing, and poor international cooperation hinder global agreements like the Paris Climate Accord.`
      },
      {
        id: 4,
        question: 'Explain the concept of eco-labelling and the ECO Mark scheme in India.',
        answer: `Eco-labelling is a voluntary method of environmental performance certification awarded to consumer products that meet specific, pre-determined environmental criteria throughout their lifecycle—from raw material extraction to disposal.

Concept of Eco-Labelling:
An eco-label informs consumers about a product's environmental footprint, empowering them to make eco-friendly purchasing choices and incentivizing manufacturers to adopt green production technologies.

The ECO Mark Scheme in India:
• Launch: Introduced in 1991 by the Ministry of Environment, Forest and Climate Change (MoEFCC) alongside the Central Pollution Control Board (CPCB).
• Logo: The scheme uses an earthen pot (Matka) as its official logo, symbolizing eco-friendliness, natural resources, and traditional Indian culture.
• Objectives:
  1. Encouraging manufacturers to produce environmentally friendly products.
  2. Guiding consumers toward sustainable consumption habits.
  3. Establishing criteria for products like detergents, paints, paper, plastics, batteries, and cosmetics based on lower environmental impact.`
      },
      {
        id: 5,
        question: 'Explain water scarcity in India and describe national/international water conflicts.',
        answer: `Water scarcity is a growing crisis in India, driven by unequal monsoon distribution, groundwater over-extraction, population growth, and river pollution. NITI Aayog reported that over 600 million Indians face high to extreme water stress.

Causes of Water Scarcity:
• Depleting Aquifers: Excessive tubewell pumping for water-intensive crops like paddy and sugarcane.
• Pollution: Industrial effluents and untreated sewage polluting major rivers like the Ganga and Yamuna.

Water Conflicts:
1. Interstate (National) Conflicts:
   - Cauvery River Water Dispute: Long-standing conflict between Karnataka and Tamil Nadu over water sharing during dry seasons.
   - Krishna River Dispute: Water allocation conflicts among Maharashtra, Karnataka, Andhra Pradesh, and Telangana.
2. International Conflicts:
   - Indus Waters Treaty (1960): Regulates water distribution of the Indus system between India and Pakistan.
   - Teesta River Dispute: Ongoing negotiations between India and Bangladesh concerning water sharing during lean rainfall months.`
      }
    ]
  },
  {
    division: 'Division D',
    description: 'Journal Questions covering Chapters 1–5.',
    questions: [
      {
        id: 1,
        question: 'Explain the relationship between environment and health, with reference to air, water, and soil-related diseases.',
        answer: `Human health is intricately linked to environmental quality. Deterioration of atmospheric, aquatic, and terrestrial systems directly causes acute and chronic human illnesses.

Environmental Determinants of Health:
1. Air-Related Diseases: Exposure to fine particulate matter (PM2.5), sulfur dioxide, and nitrogen oxides triggers respiratory diseases such as asthma, bronchitis, chronic obstructive pulmonary disease (COPD), and lung cancer. Smog and indoor air pollution from burning biomass also cause cardiovascular complications.
2. Water-Related Diseases: Drinking water contaminated with domestic sewage causes waterborne bacterial and viral infections such as cholera, dysentery, typhoid, and hepatitis A. Chemical contaminants like arsenic and fluoride cause fluorosis and skin lesions.
3. Soil-Related Diseases: Contaminated soil containing heavy metals (lead, cadmium), chemical pesticides, and industrial sludge enters the food chain. Lead causes neurological damage in children, while pesticide residues are linked to hormonal disruptions and organ toxicity.`
      },
      {
        id: 2,
        question: 'Explain the concept of Air Quality Index (AQI) and the provisions of the Air (Prevention and Control of Pollution) Act, 1981.',
        answer: `Air quality monitoring and legislative frameworks are crucial tools for managing urban atmospheric health.

Air Quality Index (AQI):
The AQI is a standardized numerical index used by government agencies to communicate real-time air quality status to the public. In India, National AQI measures eight major pollutants: PM10, PM2.5, NO₂, SO₂, CO, O₃, NH₃, and Pb.
• Color-Coded Categories: Ranging from Good (0–50, Green) to Severe (401–500, Dark Red). Higher AQI values indicate greater air pollution and severe health risks.

The Air (Prevention and Control of Pollution) Act, 1981:
• Purpose: Enacted under Article 253 of the Constitution to prevent, control, and abate air pollution in India.
• Powers of Boards: Empowers Central and State Pollution Control Boards (CPCB/SPCBs) to establish air quality standards, declare air pollution control areas, inspect industrial units, and issue mandatory operational closures.
• Penalties: Mandates strict fines and imprisonment for industrial facilities operating without consent or exceeding legal emission limits.`
      },
      {
        id: 3,
        question: 'Explain the role of individuals, community, and government in promoting sustainable development, citing relevant government schemes.',
        answer: `Achieving sustainable development requires synchronized action across three tiers: individual choices, community initiatives, and government policy.

1. Role of Individuals:
Adopting lifestyle changes such as conserving water and electricity, using public transport or electric vehicles, practicing waste segregation at home, avoiding single-use plastics, and supporting eco-labeled products.

2. Role of Community:
Participating in local reforestation drives, managing neighborhood composting, protecting sacred groves, and creating Resident Welfare Association (RWA) rainwater harvesting projects.

3. Role of Government & Schemes:
• Swachh Bharat Abhiyan: Focuses on nationwide sanitation, open-defecation-free status, and municipal solid waste processing.
• PM-KUSUM: Promotes solar-powered irrigation pumps for farmers to reduce agricultural electricity consumption and fossil fuel reliance.
• National Solar Mission: Accelerates renewable power capacity across India to combat greenhouse gas emissions.
• Jal Jeevan Mission: Provides functional household tap connections supplying clean drinking water to all rural households.`
      },
      {
        id: 4,
        question: 'What is consumer education? Explain its need, importance, and the rights under the Consumer Protection Act, 1986.',
        answer: `Consumer education is the process of educating buyers about product quality, environmental impacts, consumer rights, and market responsibilities to protect them against unfair trade practices and environmental exploitation.

Need & Importance:
1. Informed Decision-Making: Helps consumers choose safer, energy-efficient, and eco-friendly products (e.g., BEE star-rated appliances).
2. Protection Against Fraud: Safeguards buyers against adulterated goods, misleading advertisements, and defective products.
3. Environmental Awareness: Promotes responsible consumption patterns that reduce post-consumer waste.

Rights Under Consumer Protection Act, 1986 / 2019:
1. Right to Safety: Protection against hazardous products and services.
2. Right to Information: Right to be informed about quality, quantity, potency, purity, and price.
3. Right to Choose: Access to a variety of goods at competitive prices.
4. Right to be Heard: Assurance that consumer interests will receive consideration in appropriate forums.
5. Right to Redressal: Right to seek legal remedies against unfair trade practices.
6. Right to Consumer Education: Right to acquire knowledge throughout life.`
      },
      {
        id: 5,
        question: 'Explain the sources and importance of surface and groundwater resources in India.',
        answer: `Water resources in India are classified into surface water and groundwater, both vital for agricultural, industrial, and domestic survival.

Sources of Water Resources:
1. Surface Water Sources: Comprises rivers, lakes, streams, ponds, and artificial reservoirs. India is drained by major river systems divided into Himalayan Rivers (perennial rivers like Ganga, Indus, Brahmaputra fed by snowmelt) and Peninsular Rivers (monsoon-fed seasonal rivers like Godavari, Krishna, Mahanadi, Cauvery).
2. Groundwater Sources: Subterranean water stored in unconfined aquifers, water tables, and deep underground rock formations, recharged primarily through rainwater percolation.

Importance of Water Resources:
• Agricultural Support: Over 60% of Indian agriculture relies on groundwater tubewells, while surface canal networks supply major cash crops.
• Drinking Water & Sanitation: Provides municipal drinking water to over 1.4 billion citizens.
• Industrial Growth & Power: Essential for manufacturing, industrial cooling, and hydroelectric power generation.
• Ecological Maintenance: Maintains wetlands, riverine ecosystems, and terrestrial biodiversity.`
      }
    ]
  },
  {
    division: 'Division E',
    description: 'Journal Questions covering Chapters 1–5.',
    questions: [
      {
        id: 1,
        question: 'Discuss human rights, environmental ethics, and the "Right to Live" in relation to environment.',
        answer: `The intersection of human rights, environmental ethics, and constitutional law establishes that a healthy environment is a fundamental prerequisite for human dignity and existence.

Environmental Ethics:
Environmental ethics is a branch of philosophy that studies the moral relationship between human beings and the natural environment. It advocates for biocentrism and ecocentrism—arguing that animals, forests, and ecosystems possess intrinsic value independent of human economic utility.

Human Rights & "Right to Live":
• Constitutional Mandate: In India, Article 21 of the Constitution guarantees the fundamental "Right to Life and Personal Liberty".
• Judicial Precedents: The Supreme Court of India, through landmark judgments (such as Subhash Kumar v. State of Bihar, 1991), expanded Article 21 to explicitly include the "Right to Enjoy Pollution-Free Water and Air" for full enjoyment of life.
• Environmental Duties: Article 51A(g) states that it is the fundamental duty of every citizen to protect and improve the natural environment, including forests, lakes, rivers, and wildlife.`
      },
      {
        id: 2,
        question: 'Explain the process and types of recycling (paper, glass, metal, plastic) as methods of solid waste management.',
        answer: `Recycling is the process of collecting, sorting, processing, and remanufacturing discarded waste materials into new usable products, reducing landfill accumulation and raw material extraction.

Types & Processes of Recycling:
1. Paper Recycling: Waste paper is shredded, mixed with water and chemicals to create pulp, screened, de-inked, and pressed into new sheets of recycled paper or cardboard.
2. Glass Recycling: Discarded glass bottles are sorted by color, crushed into small pieces called cullet, melted at high temperatures in furnaces, and remolded into new glass containers.
3. Metal Recycling: Scrap aluminum and steel are collected, melted in energy-efficient furnaces, cast into ingots, and rolled into sheets for cans, automobiles, and construction.
4. Plastic Recycling: Plastics are sorted by resin code (PET, HDPE, PP), shredded into flakes, washed, melted, and extruded into plastic pellets used for synthetic fibers, park benches, and new containers.`
      },
      {
        id: 3,
        question: 'Explain the concept of Integrated Pest Management (IPM) and its role in sustainable agriculture.',
        answer: `Integrated Pest Management (IPM) is an ecosystem-based strategy that focuses on long-term prevention of pests through a combination of biological controls, cultural practices, habitat manipulation, and resistant crop varieties, using synthetic chemical pesticides only as a last resort.

Core Components of IPM:
1. Cultural Controls: Practicing crop rotation, intercropping, and proper spacing to make the field environment less favorable to pest infestation.
2. Mechanical & Physical Controls: Utilizing insect traps, netting, hand-picking pests, and solarizing soil to kill weed seeds and soil-borne pathogens.
3. Biological Controls: Introducing natural predators, parasites, or pathogens (e.g., ladybug beetles to control aphids, or Bacillus thuringiensis / Bt bacteria).
4. Chemical Control (Targeted): Applying low-toxicity chemical sprays strictly when pest populations exceed Economic Injury Levels (EIL).

Role in Sustainable Agriculture:
IPM prevents pesticide resistance in insects, preserves beneficial soil organisms, protects pollinators (like bees), reduces toxic runoff into streams, and lowers input costs for farmers.`
      },
      {
        id: 4,
        question: 'Discuss the important international conventions and agreements related to environment (Ramsar Convention, Stockholm Conference, Earth Summit).',
        answer: `International environmental conventions provide legal and policy frameworks for global consensus on transboundary ecological challenges.

Key Treaties & Conferences:
1. Stockholm Conference (1972):
   - The UN Conference on the Human Environment held in Stockholm, Sweden, was the first major international meeting on environmental issues.
   - Output: Created the United Nations Environment Programme (UNEP) and established the fundamental link between economic growth, poverty alleviation, and environmental protection.

2. Ramsar Convention (1971):
   - Signed in Ramsar, Iran, it is an international treaty dedicated to the conservation and wise use of wetlands of international importance.
   - Impact: India has designated numerous Ramsar sites (e.g., Chilika Lake, Sundarbans) to preserve aquatic bird habitats and biodiversity.

3. Earth Summit (1992):
   - The UN Conference on Environment and Development (UNCED) held in Rio de Janeiro, Brazil.
   - Outputs: Produced Agenda 21, the Convention on Biological Diversity (CBD), the UN Framework Convention on Climate Change (UNFCCC), and established the Rio Declaration on Environment and Development.`
      },
      {
        id: 5,
        question: 'Explain the different methods of solid waste-based watershed management structures (contour trenches, check dams, farm ponds, gabion structures).',
        answer: `Watershed management involves harvesting rainwater, slowing surface runoff, and restoring vegetative cover across drainage basins using mechanical and vegetative structures.

Key Watershed Management Structures:
1. Contour Trenches: Horizontal trenches excavated along the natural contour lines of hill slopes. They capture rain runoff, slow down water movement, reduce soil erosion, and allow water to percolate into aquifers.
2. Check Dams: Small barriers constructed across small streams or gullies using locally available stone, masonry, or concrete. They retain water for livestock and agricultural use while trapping stream sediment.
3. Farm Ponds: Large earthen pits constructed on agricultural lands to harvest direct rainfall and farm surface runoff, providing emergency supplementary irrigation during drought spells.
4. Gabion Structures: Flexible wire-mesh cages filled with stones placed across torrential streams. They slow stream velocity, prevent gully erosion, trap sediment, and promote subsurface groundwater recharge.`
      }
    ]
  },
  {
    division: 'Division E-Arts',
    description: 'Journal Questions covering Chapters 1–5.',
    questions: [
      {
        id: 1,
        question: 'Explain the factors affecting migration of people (push and pull factors) and their impact on settlements.',
        answer: `Migration is the movement of people from one geographical location to another, driven by a combination of push factors (compelling people to leave an area) and pull factors (attracting people to a new destination).

Push Factors (Origins):
• Environmental: Natural disasters (floods, droughts, earthquakes), desertification, and soil degradation.
• Socio-Economic: Lack of local employment opportunities, poverty, low agricultural yields, and inadequate healthcare or education infrastructure.
• Political: Armed conflicts, civil unrest, and persecution.

Pull Factors (Destinations):
• Superior employment opportunities, higher wages, modern healthcare, quality higher education, better living standards, and urban amenities.

Impact on Settlements:
1. On Destination (Urban Settlements): Leads to rapid urban growth, high population density, housing shortages, slum expansion, traffic congestion, and increased pressure on municipal water and waste management.
2. On Origin (Rural Settlements): Results in brain drain, agricultural labor shortages, and aging rural demographics, though offset by monetary remittances sent back home.`
      },
      {
        id: 2,
        question: 'Explain the effects of soil pollution and measures to control it.',
        answer: `Soil pollution is defined as the addition of persistent toxic chemicals, radioactive materials, or disease-causing agents to soil, resulting in a loss of fertility and ecological balance.

Effects of Soil Pollution:
1. Reduction in Soil Fertility: Excessive chemical fertilizers alter soil pH, kill beneficial soil microbes, and destroy natural earthworm habitats.
2. Bioaccumulation in Food Web: Heavy metals (arsenic, cadmium, lead) and pesticide residues absorb into crop roots, concentrating up the human food chain.
3. Groundwater Contamination: Toxic industrial sludge and agricultural chemicals leach through porous soil layers into subterranean aquifers.
4. Soil Erosion & Desertification: Loss of soil structure accelerates topsoil erosion by wind and rain.

Control Measures:
• Promoting organic farming, composting, and green manuring.
• Implementing Integrated Pest Management (IPM) to minimize chemical sprays.
• Remediating contaminated land using Phytoremediation (planting plants like sunflowers that absorb heavy metals).
• Mandatory industrial sludge treatment before land disposal.`
      },
      {
        id: 3,
        question: 'Define sustainable development. Explain the need for sustainable development with suitable examples.',
        answer: `Sustainable development is defined by the 1987 Brundtland Report ("Our Common Future") as development that meets the needs of the present without compromising the ability of future generations to meet their own needs. It balances economic growth, environmental protection, and social equity.

Need for Sustainable Development:
1. Resource Conservation: Non-renewable fossil fuels and minerals are depleting rapidly; unmonitored extraction threatens total depletion.
2. Ecological Balance: Industrial pollution, deforestation, and greenhouse gas emissions trigger global warming and species extinction.
3. Public Health: Environmental degradation directly increases pollution-related diseases.

Suitable Examples:
• Renewable Energy Transition: Replacing coal power plants with solar and wind farms (e.g., India's Bhadla Solar Park).
• Organic & Sustainable Farming: Transitioning from chemical-intensive agriculture to organic farming (e.g., Sikkim becoming the world's first 100% organic state).
• Rainwater Harvesting & Metro Transport: Cities adopting mass electric public transit and mandatory rooftop rainwater harvesting.`
      },
      {
        id: 4,
        question: 'What is Ecotourism? Explain its principles along with do\'s and don\'ts for tourists.',
        answer: `Ecotourism is responsible travel to natural areas that conserves the environment, sustains the well-being of local communities, and involves educational interpretation for visitors.

Core Principles of Ecotourism:
1. Minimizing physical, behavioral, and ecological impacts on natural biomes.
2. Building environmental awareness and cultural respect.
3. Providing positive financial benefits for local conservation and host communities.

Do's for Tourists:
• Do respect local cultural traditions, dress codes, and customs.
• Do stay in eco-friendly homestays and hire local indigenous guides.
• Do carry reusable water bottles and dispose of waste in designated recycling bins.
• Do maintain a safe, respectful distance from wild animals.

Don'ts for Tourists:
• Don't litter plastic bottles, wrappers, or cigarette butts in pristine nature reserves.
• Don't disturb wildlife by making loud noises, playing music, or using flash photography.
• Don't purchase souvenirs made from endangered wildlife, coral, or illegal timber.
• Don't stray off designated trekking trails in national parks.`
      },
      {
        id: 5,
        question: 'Explain the National Water Policy 2002 and describe methods to control water pollution.',
        answer: `Water policy frameworks establish guidelines for equitable resource distribution, river conservation, and pollution control across India.

National Water Policy 2002:
Adopted by the Ministry of Water Resources, the policy establishes clear water allocation priorities:
1. Drinking Water: Top priority for allocation across all regions.
2. Irrigation, Hydro-power, Ecology, Agro-industries, and Navigation follow in priority.
• Key Objectives: Encouraging integrated watershed management, promoting rainwater harvesting, conserving groundwater, and requiring industrial water recycling.

Methods to Control Water Pollution:
1. Sewage Treatment Plants (STPs): Mandatory primary, secondary, and tertiary treatment of municipal sewage before discharge into rivers.
2. Effluent Treatment Plants (ETPs): Requiring industrial plants to treat toxic liquid effluents, enforcing Zero Liquid Discharge (ZLD) norms.
3. Eco-Sanitation & Artificial Wetlands: Utilizing bio-filtration systems and wetland plants (like water hyacinth and reed beds) to absorb nutrients naturally.
4. Restricting Agro-Chemical Runoff: Encouraging organic biofertilizers to prevent nutrient runoff into lakes and rivers.`
      }
    ]
  }
];
