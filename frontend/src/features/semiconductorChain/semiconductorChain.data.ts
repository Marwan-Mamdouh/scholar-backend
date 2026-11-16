import { ChainLayer, FlowStep, LayerId } from "./semiconductorChain.type";

export const DEFAULT_LAYER: LayerId = "chip-design";

/** Scroll and focus targets. Kept out of the hook: server components read them,
 *  and exports of a "use client" module arrive as client references. */
export const LAYER_DETAIL_ID = "layer-detail";
export const LAYER_HEADING_ID = "layer-detail-heading";

export const SEMICONDUCTOR_LAYERS: ChainLayer[] = [
  {
    id: "chip-design",
    number: 1,
    name: "Chip Design (IP & Fabless)",
    shortName: "Chip Design",
    position: "The apex",
    tagline: "Where a chip exists only as an idea, an architecture, and a blueprint.",
    overview:
      "This is the starting point of the whole chain — the idea and architecture stage. Nothing physical is made here. Companies at this level either license the building blocks of a chip (IP) or design entire chips (fabless) and then hand the blueprint off to someone else to manufacture. Because it sits at the top, this layer has no layer before it — it is the origin of every downstream step. Every other layer exists to eventually turn what happens here into a physical product.",
    relationshipToPreviousLayer: null,
    keyTakeaway:
      "Nothing here touches a factory floor. This layer is pure architecture and intellectual property. Every company at this level depends on the next layer down to turn their designs into working silicon.",
    tone: "accent",
    subGroups: [
      {
        id: "ip-providers",
        title: "Intellectual Property (IP) Providers",
        summary:
          "They sell the reusable building blocks and the software used to assemble a chip — never a chip itself.",
        companies: [
          {
            name: "Arm",
            whatTheyDo:
              "License instruction sets and processor microarchitectures — the core recipe for how a chip's brain works — rather than building chips.",
            whoTheyTarget:
              "Fabless designers and IDMs who need a proven, efficient CPU architecture instead of building one from scratch, such as Qualcomm, Apple, MediaTek and Samsung.",
            linkToPreviousLayer:
              "There is no layer before this one — Arm is the starting point. Its designs become the foundation that fabless companies and IDMs build their own chips on top of.",
          },
          {
            name: "Synopsys",
            whatTheyDo:
              "Provide EDA (Electronic Design Automation) software plus reusable IP blocks used to design, simulate and verify chips.",
            whoTheyTarget:
              "Any company designing silicon — fabless firms, IDMs, and in-house design teams at big tech companies.",
            linkToPreviousLayer:
              "Same apex level as Arm; supplies the tools that make Arm's and others' designs actually buildable.",
          },
          {
            name: "Cadence",
            whatTheyDo:
              "Also an EDA and IP provider competing directly with Synopsys, offering design, simulation and verification tools plus IP libraries.",
            whoTheyTarget:
              "The same customer base as Synopsys — chip designers of all sizes who need software to turn an idea into a manufacturable layout.",
            linkToPreviousLayer:
              "Peer of Arm and Synopsys at the apex; without these tools nothing below can be taped out, meaning finalised for manufacturing.",
          },
        ],
      },
      {
        id: "fabless-designers",
        title: "Fabless Chip Designers",
        summary:
          "They design complete chips end to end, then outsource every gram of manufacturing.",
        companies: [
          {
            name: "NVIDIA",
            whatTheyDo: "Design GPUs and AI accelerator chips, but own no factories.",
            whoTheyTarget:
              "Data centres, cloud providers, gaming PC makers and AI companies that need high-performance compute.",
            linkToPreviousLayer:
              "Licenses IP and tools from Arm, Synopsys and Cadence to design its chips, then relies entirely on foundries in the next layer down to physically build them.",
          },
          {
            name: "Qualcomm",
            whatTheyDo: "Design mobile processors and modem chips, including the Snapdragon line.",
            whoTheyTarget: "Smartphone and device makers such as Samsung and Xiaomi.",
            linkToPreviousLayer:
              "Heavy Arm-architecture licensee; designs the chip, then outsources fabrication.",
          },
          {
            name: "AMD",
            whatTheyDo: "Design CPUs and GPUs for PCs, servers and gaming consoles.",
            whoTheyTarget:
              "PC manufacturers, data centres and console makers such as Sony and Microsoft.",
            linkToPreviousLayer:
              "Uses EDA tools from Synopsys and Cadence to design chips it never manufactures itself.",
          },
          {
            name: "Apple",
            whatTheyDo:
              "Design its own custom silicon — the A-series and M-series chips — for its devices only.",
            whoTheyTarget:
              "Its own internal product lines (iPhone, Mac, iPad) rather than external customers.",
            linkToPreviousLayer:
              "Licenses Arm architecture as the base of its chip designs, then sends the design to a foundry to manufacture.",
          },
          {
            name: "MediaTek",
            whatTheyDo: "Design mid-range and budget mobile and IoT chipsets.",
            whoTheyTarget:
              "Budget and mid-tier smartphone brands, smart TV and IoT device makers.",
            linkToPreviousLayer:
              "Same pattern — Arm-based designs, EDA tooling from Synopsys and Cadence, manufacturing outsourced downstream.",
          },
        ],
      },
    ],
  },
  {
    id: "wafer-fab-equipment",
    number: 2,
    name: "Wafer Fab Equipment",
    shortName: "Wafer Fab Equipment",
    position: "Second from the top",
    tagline: "The factory inside the factory — machines that print chips at nanometre scale.",
    overview:
      "This layer doesn't design chips or make chips — it makes the machines that print and shape chips at the nanometer scale. Without this equipment, the blueprints from Layer 1 could never become physical silicon. It is often called the factory inside the factory, because these machines are what foundries and IDMs actually install inside their fabs.",
    relationshipToPreviousLayer:
      "Layer 1 companies hand off a finished digital design. That design is meaningless without the physical tools in this layer to actually etch, deposit and pattern it onto silicon. In short: Layer 1 says what to build, Layer 2 provides the tools that make building possible.",
    keyTakeaway:
      "This layer converts abstract designs into a physically achievable process. It is the direct enabler of everything in the next layer down — a foundry is essentially a building full of equipment from these very companies.",
    tone: "primary",
    subGroups: [
      {
        id: "lithography",
        title: "Nanometer Lithography (EUV / DUV)",
        summary: "The machines that project a design onto a wafer in the first place.",
        companies: [
          {
            name: "ASML",
            whatTheyDo:
              "Build EUV (Extreme Ultraviolet) and DUV lithography machines — the systems that project chip designs onto silicon wafers at incredibly small scales. ASML has a near-monopoly on EUV.",
            whoTheyTarget:
              "The world's leading foundries and IDMs — TSMC, Samsung, Intel — since only the most advanced fabs can afford and operate EUV systems.",
            linkToPreviousLayer:
              "Takes the pattern defined by chip designers upstream and makes it possible to physically project that pattern onto a wafer. Without ASML's machines, the most advanced designs from Layer 1 could never be manufactured.",
          },
        ],
      },
      {
        id: "deposition-etch-metrology",
        title: "Deposition, Etch & Metrology",
        summary:
          "Everything that happens around lithography — building layers up, carving them away, and checking the result.",
        companies: [
          {
            name: "Applied Materials",
            whatTheyDo:
              "Build equipment for depositing thin material layers onto wafers and other fabrication steps beyond lithography.",
            whoTheyTarget: "Foundries and IDMs building advanced logic and memory chips.",
            linkToPreviousLayer:
              "Complements ASML's lithography step — once a pattern is projected, Applied Materials' tools help build up the physical layers of the chip based on that pattern.",
          },
          {
            name: "Lam Research",
            whatTheyDo:
              "Specialise in etch and deposition equipment, removing or adding material with extreme precision.",
            whoTheyTarget:
              "The same customer base — major foundries and IDMs needing precise material control at advanced nodes.",
            linkToPreviousLayer:
              "Works hand-in-hand with lithography; after ASML prints the pattern, Lam's tools etch away material to physically carve the design into the wafer.",
          },
          {
            name: "KLA",
            whatTheyDo:
              "Build inspection and metrology (measurement) tools that detect defects and verify chips are being made correctly.",
            whoTheyTarget: "Foundries and IDMs who need quality control at every manufacturing step.",
            linkToPreviousLayer:
              "Acts as the quality checkpoint — verifying that what ASML, Applied Materials and Lam Research physically produced actually matches the design handed down from Layer 1.",
          },
        ],
      },
    ],
  },
  {
    id: "fab-foundries",
    number: 3,
    name: "FAB & Foundries",
    shortName: "FAB & Foundries",
    position: "Middle of the pyramid",
    tagline: "The most capital-intensive layer — where a blueprint finally becomes silicon.",
    overview:
      "This is where designs actually become physical chips. Companies here operate the giant, extremely expensive factories (fabs) that use the equipment from Layer 2 to manufacture silicon wafers. This layer splits into two models: pure-play foundries who only manufacture and never design, and Integrated Device Manufacturers (IDMs) who design and manufacture under one roof.",
    relationshipToPreviousLayer:
      "Every fab in this layer is essentially a building filled with machines from ASML, Applied Materials, Lam Research and KLA. Without Layer 2's equipment none of these companies could operate. The equipment layer supplies the how; this layer supplies the where and the who — the actual production lines.",
    keyTakeaway:
      "This is the most capital-intensive layer in the entire chain. It's the literal bridge between the idea in Layer 1 and the physical chip — made possible only by the equipment purchased from Layer 2.",
    tone: "accent",
    subGroups: [
      {
        id: "pure-play-foundries",
        title: "Pure-Play Foundries",
        summary: "They manufacture other companies' designs and own no chip designs of their own.",
        companies: [
          {
            name: "TSMC",
            whatTheyDo:
              "Manufacture chips designed by other companies at the most advanced process nodes in the world. Owns no chip designs of its own.",
            whoTheyTarget:
              "Fabless giants like Apple, NVIDIA, AMD and Qualcomm who need someone to physically build their designs.",
            linkToPreviousLayer:
              "Runs the largest fleet of ASML EUV machines in the world; its entire manufacturing capability depends on Layer 2's equipment vendors.",
          },
          {
            name: "Samsung Foundry",
            whatTheyDo:
              "Manufactures chips for external customers in addition to Samsung's own products, competing with TSMC at advanced nodes.",
            whoTheyTarget:
              "Fabless companies looking for an alternative to TSMC, plus Samsung's internal divisions.",
            linkToPreviousLayer:
              "Also a major buyer of EUV and etch/deposition tools from Layer 2 companies.",
          },
          {
            name: "UMC",
            whatTheyDo: "Manufacture chips at more mature, less cutting-edge process nodes.",
            whoTheyTarget:
              "Companies needing reliable, cost-effective chips that don't require the bleeding edge — automotive, IoT and analog chips.",
            linkToPreviousLayer:
              "Uses older but still essential generations of the same equipment types from Layer 2.",
          },
          {
            name: "GlobalFoundries",
            whatTheyDo:
              "Similar to UMC — mature-node manufacturing and specialty processes such as RF and automotive-grade chips.",
            whoTheyTarget:
              "Automotive, industrial and communications chip designers who prioritise reliability over the smallest transistor size.",
            linkToPreviousLayer:
              "Same dependency on Layer 2 equipment, just deployed for different process generations.",
          },
          {
            name: "SMIC",
            whatTheyDo:
              "China's largest foundry, manufacturing chips domestically and working to close the gap with TSMC and Samsung on advanced nodes.",
            whoTheyTarget:
              "Chinese fabless companies and international clients seeking non-Taiwan and non-Korea manufacturing options.",
            linkToPreviousLayer:
              "Also dependent on equipment vendors from Layer 2, though export restrictions have limited its access to the most advanced ASML EUV tools.",
          },
        ],
      },
      {
        id: "idms",
        title: "Integrated Device Manufacturers (IDMs)",
        summary: "They design and manufacture their own chips under one roof.",
        companies: [
          {
            name: "Intel",
            whatTheyDo:
              "Design and manufacture its own chips in-house, though it has begun opening its fabs to outside customers too.",
            whoTheyTarget:
              "PC and server markets directly with its own branded chips, and increasingly external fabless clients as a foundry service.",
            linkToPreviousLayer:
              "Buys the same equipment from ASML, Applied Materials and others, but unlike TSMC uses it to build its own in-house designs rather than only manufacturing for others.",
          },
          {
            name: "Texas Instruments",
            whatTheyDo: "Design and manufacture analog and embedded processing chips end to end.",
            whoTheyTarget:
              "Industrial, automotive and electronics companies needing analog components such as power management and sensors.",
            linkToPreviousLayer:
              "Operates its own fabs stocked with Layer 2 equipment, giving it full control over quality and supply.",
          },
          {
            name: "NXP",
            whatTheyDo:
              "Design and manufacture chips for automotive and IoT applications, with a mix of in-house and outsourced production.",
            whoTheyTarget: "Automakers and industrial IoT device makers.",
            linkToPreviousLayer:
              "Partially dependent on both its own fabs using Layer 2 equipment and on foundries like TSMC for some products.",
          },
          {
            name: "Infineon",
            whatTheyDo: "Design and manufacture power semiconductors and automotive chips.",
            whoTheyTarget: "Automotive, renewable energy and industrial customers.",
            linkToPreviousLayer:
              "Runs its own fabs, purchasing deposition, etch and lithography tools directly from Layer 2 vendors.",
          },
        ],
      },
    ],
  },
  {
    id: "materials-osat-oem",
    number: 4,
    name: "Materials, OSAT & End Products",
    shortName: "Materials, OSAT & End Products",
    position: "The base",
    tagline: "Two bookends in one — the inputs that start the chain and the products that end it.",
    overview:
      "This is the foundation of the pyramid, and it covers three distinct roles: the raw materials that make manufacturing possible in the first place, the assembly, testing and packaging (OSAT) that happens after a wafer is manufactured, and the OEMs that put finished chips into products people actually buy. Even though it's drawn at the base, in practice materials come before the fabs use them while OSAT and OEMs come after — this layer bookends the whole chain on both sides.",
    relationshipToPreviousLayer:
      "Materials and components actually feed into Layer 3 — foundries can't run without wafers and chemicals. OSAT companies pick up the finished, raw silicon dies immediately after Layer 3's foundries produce them, packaging and testing them so they're usable. OEMs then take the packaged, tested chip and build it into the finished device that ends up in a customer's hands. So this layer both supplies and completes the work done in Layer 3.",
    keyTakeaway:
      "This layer is really two bookends in one: materials companies enable Layer 3 to begin manufacturing, while OSAT and OEM companies complete the journey after Layer 3 finishes — turning a raw silicon die into a phone, laptop or car sitting in someone's hands.",
    tone: "primary",
    subGroups: [
      {
        id: "materials-components",
        title: "Materials & Components",
        summary:
          "Feeds upward into Layer 3 — without these inputs a fab cannot start production at all.",
        companies: [
          {
            name: "Shin-Etsu",
            whatTheyDo:
              "Produce ultra-pure silicon wafers, the physical starting material every chip is built on.",
            whoTheyTarget:
              "All foundries and IDMs — TSMC, Samsung, Intel — who need raw wafers before any manufacturing can begin.",
            linkToPreviousLayer:
              "Actually supplies up into Layer 3 — foundries cannot even start production without wafers from companies like Shin-Etsu.",
          },
          {
            name: "SUMCO",
            whatTheyDo: "Another major supplier of silicon wafers.",
            whoTheyTarget: "The same customer base as Shin-Etsu — foundries worldwide.",
            linkToPreviousLayer:
              "Direct input supplier to Layer 3's fabs; a shortage here would halt manufacturing entirely.",
          },
          {
            name: "BASF",
            whatTheyDo:
              "Supply specialty chemicals used in the chip fabrication process, including cleaning agents and photoresists.",
            whoTheyTarget:
              "Foundries and fabs needing precise chemical inputs for each manufacturing step.",
            linkToPreviousLayer:
              "Supplies consumable chemicals that Layer 3's fabs use continuously during production.",
          },
          {
            name: "Air Liquide",
            whatTheyDo:
              "Supply industrial and specialty gases essential to semiconductor manufacturing, for example in deposition and etching processes.",
            whoTheyTarget: "Foundries and fabs that need a constant, ultra-pure gas supply.",
            linkToPreviousLayer:
              "Another critical input supplier feeding directly into Layer 3's manufacturing processes.",
          },
          {
            name: "Murata",
            whatTheyDo:
              "Manufacture passive electronic components such as capacitors and filters used alongside chips in finished devices.",
            whoTheyTarget:
              "Device makers (OEMs) and sometimes chipmakers needing supporting components.",
            linkToPreviousLayer:
              "Supplies components that get combined with chips from Layer 3 during final device assembly.",
          },
          {
            name: "TDK",
            whatTheyDo:
              "Similar to Murata — produce passive components and materials used in electronics manufacturing.",
            whoTheyTarget: "Electronics and device manufacturers.",
            linkToPreviousLayer:
              "Complements the silicon output of Layer 3 with the supporting components devices also need.",
          },
        ],
      },
      {
        id: "osat",
        title: "Assembly, Test & Packaging (OSAT)",
        summary: "Picks up exactly where the foundry leaves off, turning a raw die into a usable chip.",
        companies: [
          {
            name: "Amkor",
            whatTheyDo:
              "Take finished, raw silicon dies from foundries and package them into the protective casing and connectors that let them be used in a device, then test them for defects.",
            whoTheyTarget:
              "Foundries and fabless companies who need their finished wafers turned into usable, sellable chips.",
            linkToPreviousLayer:
              "Picks up directly where Layer 3's foundries leave off — takes the raw manufactured die and makes it physically usable in a real product.",
          },
          {
            name: "JCET",
            whatTheyDo:
              "China's largest OSAT provider, offering the same packaging and testing services as Amkor.",
            whoTheyTarget:
              "Chinese and international chip designers and foundries needing packaging and test services.",
            linkToPreviousLayer:
              "Same role as Amkor — the direct next step after Layer 3's foundries produce raw dies.",
          },
        ],
      },
      {
        id: "oems",
        title: "Original Equipment Manufacturers (OEMs)",
        summary: "The final destination — where a packaged chip becomes something you can buy.",
        companies: [
          {
            name: "Apple",
            whatTheyDo:
              "Build the final consumer devices — iPhone, Mac, iPad — using chips designed in Layer 1 and packaged in this layer.",
            whoTheyTarget: "Everyday consumers.",
            linkToPreviousLayer:
              "Takes the fully packaged and tested chip, post-OSAT, and integrates it into a finished, sellable product.",
          },
          {
            name: "Tesla",
            whatTheyDo:
              "Build vehicles that rely on custom and third-party chips for autonomous driving and vehicle systems.",
            whoTheyTarget: "Car buyers.",
            linkToPreviousLayer:
              "Uses packaged, tested chips as functional components inside a much larger finished product — the car.",
          },
          {
            name: "Microsoft, Google & Amazon",
            note: "Cloud and device makers",
            whatTheyDo:
              "Build devices such as Surface, Pixel and Kindle/Echo, plus the cloud infrastructure that runs on chips sourced through this entire chain.",
            whoTheyTarget: "Consumers and enterprise cloud customers.",
            linkToPreviousLayer:
              "Rely on OSAT-finished chips — sometimes their own custom silicon, sometimes third-party — to power both hardware products and data centres.",
          },
          {
            name: "Samsung, Dell & Sony",
            note: "Consumer electronics makers",
            whatTheyDo:
              "Manufacture consumer electronics — phones, laptops, gaming consoles and TVs — that house chips from earlier in the chain.",
            whoTheyTarget: "Everyday consumers across phones, computers and entertainment devices.",
            linkToPreviousLayer:
              "The final destination — they take fully finished, tested chips and assemble them into the products people actually buy and use.",
          },
        ],
      },
    ],
  },
];

/**
 * The pyramid orders layers by abstraction, but production runs in a different order:
 * materials feed the fab before it starts, and OSAT/OEM only act once it finishes.
 */
export const CHAIN_FLOW_STEPS: FlowStep[] = [
  {
    step: 1,
    title: "Design the chip",
    description:
      "IP and EDA vendors supply the building blocks; fabless designers turn them into a finished blueprint and tape it out.",
    layers: ["chip-design"],
  },
  {
    step: 2,
    title: "Equip & supply the fab",
    description:
      "Lithography, etch and metrology machines are installed, while wafers, chemicals and gases arrive as continuous inputs.",
    layers: ["wafer-fab-equipment", "materials-osat-oem"],
  },
  {
    step: 3,
    title: "Manufacture the wafer",
    description:
      "Foundries and IDMs run the blueprint through their production lines and produce raw silicon dies.",
    layers: ["fab-foundries"],
  },
  {
    step: 4,
    title: "Package & test",
    description:
      "OSAT providers encase each die, add its connectors and test it for defects so it becomes a usable, sellable chip.",
    layers: ["materials-osat-oem"],
  },
  {
    step: 5,
    title: "Build the product",
    description:
      "OEMs assemble the packaged chip into a phone, laptop, car or data centre that reaches an actual customer.",
    layers: ["materials-osat-oem"],
  },
];

export const getLayerById = (id: LayerId): ChainLayer => {
  const match = SEMICONDUCTOR_LAYERS.find((layer) => layer.id === id);

  if (!match) {
    // Unreachable for typed callers; a stale id in CHAIN_FLOW_STEPS would
    // otherwise render the apex under someone else's name, silently.
    if (process.env.NODE_ENV !== "production") {
      console.error(`[semiconductorChain] Unknown layer id "${id}" — falling back to the apex.`);
    }

    return SEMICONDUCTOR_LAYERS[0];
  }

  return match;
};

export const isLayerId = (value: unknown): value is LayerId =>
  SEMICONDUCTOR_LAYERS.some((layer) => layer.id === value);

export const countCompanies = (layer: ChainLayer): number =>
  layer.subGroups.reduce((total, group) => total + group.companies.length, 0);
