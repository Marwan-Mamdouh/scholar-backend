import {
  CatalogTool,
  DomainPage,
  StagePanelData,
} from "../tools.type";

const catalogTools: CatalogTool[] = [
  {cat:'schem',name:'xschem',core:true,desc:'The premier schematic editor for open-source analog design. Integrates natively with ngspice and generates simulation netlists.',use:'Primary schematic capture tool.',gh:'https://github.com/StefanSchippers/xschem',web:'https://xschem.sourceforge.io'},
  {cat:'schem',name:'xcircuit',desc:'Legacy schematic editor that generates SPICE netlists. Stable and suitable for simple circuits.',use:'Alternative schematic entry.',web:'http://opencircuitdesign.com/xcircuit/'},
  {cat:'schem',name:'schemdraw',desc:'Python library for drawing electrical schematics programmatically. Great for documentation and publications.',use:'Generating schematic diagrams in Python.',gh:'https://github.com/cdelker/schemdraw',docs:'https://schemdraw.readthedocs.io'},
  {cat:'sim',name:'ngspice',core:true,desc:'Full-featured open-source SPICE simulator. Supports OSDI for compact device models and integrates directly with xschem.',use:'Primary SPICE simulation engine.',gh:'https://github.com/ngspice/ngspice',web:'https://ngspice.sourceforge.io',docs:'https://ngspice.sourceforge.io/docs.html'},
  {cat:'sim',name:'Xyce',core:true,desc:'High-performance, parallel SPICE simulator from Sandia National Labs. Excels at large-scale circuits and supports XDM for netlist conversion.',use:'Simulating massive circuits or requiring multi-threading.',gh:'https://github.com/Xyce/Xyce',web:'https://xyce.sandia.gov'},
  {cat:'sim',name:'OpenVAF',desc:'Verilog-A compiler for building compact device models. Compiles to OSDI objects used by ngspice and Xyce.',use:'Compiling advanced transistor models.',gh:'https://github.com/pascalkuthe/OpenVAF',web:'https://openvaf.semimod.de'},
  {cat:'sim',name:'Qucs-S',desc:'Simulation environment with an RF focus. Supports ngspice, Xyce, and SpectreRF as backends.',use:'RF and microwave circuit simulation.',gh:'https://github.com/ra3xdh/qucs_s',web:'https://ra3xdh.github.io'},
  {cat:'sim',name:'IRSIM',desc:'Switch-level digital simulator operating at the transistor level. Useful for mixed-signal validation.',use:'Transistor-level digital simulation.',gh:'https://github.com/RTimothyEdwards/irsim'},
  {cat:'wave',name:'gaw3-xschem',core:true,desc:'Waveform viewer specifically tailored for xschem. Directly displays ngspice results with seamless integration.',use:'Viewing SPICE waveforms from xschem.',gh:'https://github.com/StefanSchippers/xschem-gaw'},
  {cat:'wave',name:'spyci',desc:'Python tool for parsing and plotting ngspice and Xyce raw data. Uses matplotlib and is great for scripting.',use:'Automated waveform plotting in Python.',gh:'https://github.com/gmagno/spyci'},
  {cat:'wave',name:'surfer',desc:'Modern, high-performance waveform viewer built in Rust. Supports VCD and FST with a smooth interface.',use:'Viewing digital/mixed-signal waveforms.',gh:'https://github.com/surfer-project/surfer',web:'https://surfer-project.org'},
  {cat:'layout',name:'Magic VLSI',core:true,desc:'The most widely used open-source layout editor. Includes interactive DRC, extraction, and LVS support for open PDKs.',use:'Analog layout editing and interactive DRC.',gh:'https://github.com/RTimothyEdwards/magic',web:'http://opencircuitdesign.com/magic/'},
  {cat:'layout',name:'KLayout',core:true,desc:'Professional layout viewer and editor for GDSII/OASIS. Features DRC scripting in Python or Ruby.',use:'GDSII inspection, layout editing, and scripted DRC.',gh:'https://github.com/KLayout/klayout',web:'https://www.klayout.de'},
  {cat:'layout',name:'GDS3D',desc:'3D viewer for GDSII layouts. Renders layouts in three dimensions to better understand layer stacks.',use:'Visualizing complex metal stacks.',gh:'https://github.com/trilomix/GDS3D'},
  {cat:'layout',name:'gdspy',desc:'Python module for creating and modifying GDSII files. Essential for scripted layout generation.',use:'Programmatic GDSII generation.',gh:'https://github.com/heitzmann/gdspy',docs:'https://gdspy.readthedocs.io'},
  {cat:'layout',name:'gdsfactory',desc:'Advanced Python library for generating GDSII layouts. Widely used in photonics and scripted analog layouts.',use:'Complex programmatic layouts and photonics.',gh:'https://github.com/gdsfactory/gdsfactory',docs:'https://gdsfactory.github.io/gdsfactory/'},
  {cat:'layout',name:'OpenRAM',desc:'Python framework for automated SRAM generation. Outputs complete GDSII, schematic, and timing files.',use:'Generating custom SRAM macros.',gh:'https://github.com/VLSIDA/OpenRAM',web:'https://openram.org'},
  {cat:'verif',name:'Netgen',core:true,desc:'The standard open-source LVS tool. Compares schematic netlists against layout netlists to ensure equivalence.',use:'Layout vs. Schematic verification.',gh:'https://github.com/RTimothyEdwards/netgen',web:'http://opencircuitdesign.com/netgen/'},
  {cat:'verif',name:'klayout-pex',desc:'Parasitic extraction plugin for KLayout. Extracts RC parasitics directly within the KLayout environment.',use:'Parasitic extraction from KLayout.',gh:'https://github.com/klayoutmatthias/klayout_pex'},
  {cat:'verif',name:'CVC',desc:'Circuit Validity Checker. Performs Electrical Rules Checking (ERC) on netlists to find common errors.',use:'Electrical rule checking (ERC) prior to simulation.',gh:'https://github.com/d-m-bailey/cvc'},
  {cat:'char',name:'lctime',core:true,desc:'Characterization kit for CMOS standard cells. Generates Liberty (.lib) timing files from ngspice simulations.',use:'Standard cell timing characterization.',gh:'https://github.com/librecell/lctime'},
  {cat:'char',name:'CACE',desc:'Circuit Automatic Characterization Engine. Automates simulation runs and parameter extraction using Python.',use:'Automated analog block characterization.',gh:'https://github.com/RTimothyEdwards/cace'},
  {cat:'char',name:'PyOPUS',desc:'Simulation driver and optimization tool for analog circuits. Supports multi-objective optimization.',use:'Analog circuit sizing and optimization.',web:'https://fides.fe.uni-lj.si/pyopus/'},
  {cat:'python',name:'spicelib',desc:'Library for interacting with SPICE simulators from Python. Supports ngspice, Xyce, and LTspice.',use:'Python scripting for SPICE tools.',gh:'https://github.com/nunobrum/spicelib',docs:'https://spicelib.readthedocs.io'},
  {cat:'python',name:'PySpice',desc:'Python interface for ngspice and Xyce. Defines circuits in Python and runs them natively.',use:'Python-based circuit definition and simulation.',gh:'https://github.com/FabriceSalvaire/PySpice',docs:'https://pyspice.fabrice-salvaire.fr'},
  {cat:'python',name:'ngspyce',desc:'Direct Python bindings to the ngspice shared library. Uses the ngspice API without subprocess overhead.',use:'High-performance Python integration with ngspice.',gh:'https://github.com/ignamv/ngspyce'},
  {cat:'python',name:'Hdl21',desc:'Analog Hardware Description Library in Python. Defines circuits and hierarchies as Python objects.',use:'Pythonic analog hardware description.',gh:'https://github.com/dan-fritchman/Hdl21'},
  {cat:'python',name:'pygmid',desc:'Python implementation of the gm/Id starter kit. Facilitates modern analog design methodologies.',use:'gm/Id methodology sizing.',gh:'https://github.com/bmurmann/pygmid'},
  {cat:'rf',name:'RF Toolkit',desc:'Suite including FastHenry2 (inductance), FasterCap (capacitance), and openEMS (EM simulation).',use:'Electromagnetic extraction and simulation.',gh:'https://github.com/ediloren/FastHenry2'},
  {cat:'rf',name:'scikit-rf',desc:'Python package for RF network analysis. Handles S-parameters, touchstone files, and RF math.',use:'RF data analysis and plotting.',gh:'https://github.com/scikit-rf/scikit-rf',docs:'https://scikit-rf.readthedocs.io'},
  {cat:'pdk',name:'SkyWater SKY130 PDK',core:true,desc:"The first open-source 130nm PDK from Google and SkyWater. The foundation of open analog design.",use:'Target technology for analog tape-outs.',gh:'https://github.com/google/skywater-pdk',docs:'https://skywater-pdk.readthedocs.io'},
  {cat:'pdk',name:'GF180MCU PDK',desc:'180nm CMOS PDK from GlobalFoundries. An excellent older node for analog and high-voltage design.',use:'Alternative node for analog designs.',gh:'https://github.com/google/gf180mcu-pdk'},
  {cat:'pdk',name:'IHP SG13G2 PDK',desc:'130nm SiGe:C BiCMOS PDK from IHP. Outstanding for RF and high-speed analog design.',use:'RF and high-speed mixed-signal design.',gh:'https://github.com/IHP-GmbH/IHP-Open-PDK'},
  {cat:'pdk',name:'Open_PDKs',desc:'Scripts for installing and configuring open-source PDKs for tools like Magic, xschem, and ngspice.',use:'PDK installation and tool setup.',gh:'https://github.com/RTimothyEdwards/open_pdks'},
  {cat:'pdk',name:'volare',desc:'Version manager and builder for open-source PDKs. Easily switch between PDK versions.',use:'Managing PDK versions.',gh:'https://github.com/efabless/volare'}
];

const panels: Record<string, StagePanelData> = {
  schem:{eye:'Stage 01 — Schematic',title:'Schematic Entry',desc:'The analog design process begins with capturing the circuit schematic. This defines the components, connectivity, and parameters before moving to simulation.',cats:[
    {title:'Schematic Editors',tools:[
      {name:'xschem',tags:['core'],desc:'The premier schematic editor for open-source analog design. Integrates natively with ngspice.',use:'Primary schematic capture tool.',gh:'https://github.com/StefanSchippers/xschem',web:'https://xschem.sourceforge.io'},
      {name:'xcircuit',desc:'Legacy schematic editor that generates SPICE netlists.',use:'Alternative schematic entry.',web:'http://opencircuitdesign.com/xcircuit/'},
      {name:'schemdraw',desc:'Python library for drawing electrical schematics programmatically.',use:'Generating schematic diagrams in Python.',gh:'https://github.com/cdelker/schemdraw',docs:'https://schemdraw.readthedocs.io'}
    ]}
  ]},
  sim:{eye:'Stage 02 — Simulation',title:'SPICE Simulation',desc:'Pre-layout and post-layout circuit simulation using accurate device models. Evaluates DC, AC, transient, and noise behavior.',cats:[
    {title:'SPICE Simulators',tools:[
      {name:'ngspice',tags:['core'],desc:'Full-featured open-source SPICE simulator. Integrates directly with xschem.',use:'Primary SPICE simulation engine.',gh:'https://github.com/ngspice/ngspice',web:'https://ngspice.sourceforge.io',docs:'https://ngspice.sourceforge.io/docs.html'},
      {name:'Xyce',tags:['fast'],desc:'High-performance, parallel SPICE simulator from Sandia National Labs.',use:'Simulating massive circuits or requiring multi-threading.',gh:'https://github.com/Xyce/Xyce',web:'https://xyce.sandia.gov'},
      {name:'OpenVAF',desc:'Verilog-A compiler for building compact device models.',use:'Compiling advanced transistor models.',gh:'https://github.com/pascalkuthe/OpenVAF',web:'https://openvaf.semimod.de'},
      {name:'Qucs-S',desc:'Simulation environment with an RF focus.',use:'RF and microwave circuit simulation.',gh:'https://github.com/ra3xdh/qucs_s',web:'https://ra3xdh.github.io'},
      {name:'IRSIM',desc:'Switch-level digital simulator operating at the transistor level.',use:'Transistor-level digital simulation.',gh:'https://github.com/RTimothyEdwards/irsim'}
    ]},
    {title:'Waveform Viewers',tools:[
      {name:'gaw3-xschem',tags:['core'],desc:'Waveform viewer specifically tailored for xschem.',use:'Viewing SPICE waveforms from xschem.',gh:'https://github.com/StefanSchippers/xschem-gaw'},
      {name:'spyci',desc:'Python tool for parsing and plotting ngspice and Xyce raw data.',use:'Automated waveform plotting in Python.',gh:'https://github.com/gmagno/spyci'},
      {name:'surfer',desc:'Modern, high-performance waveform viewer built in Rust.',use:'Viewing digital/mixed-signal waveforms.',gh:'https://github.com/surfer-project/surfer',web:'https://surfer-project.org'}
    ]}
  ]},
  layout:{eye:'Stage 03A — Layout',title:'Custom Layout & Routing',desc:'Translating the schematic into a physical mask layout. Includes manual polygon pushing, automated generation, and layout viewing.',cats:[
    {title:'Layout Editors',tools:[
      {name:'Magic VLSI',tags:['core'],desc:'The most widely used open-source layout editor. Includes interactive DRC.',use:'Analog layout editing and interactive DRC.',gh:'https://github.com/RTimothyEdwards/magic',web:'http://opencircuitdesign.com/magic/'},
      {name:'KLayout',tags:['core'],desc:'Professional layout viewer and editor for GDSII/OASIS.',use:'GDSII inspection, layout editing, and scripted DRC.',gh:'https://github.com/KLayout/klayout',web:'https://www.klayout.de'},
      {name:'GDS3D',desc:'3D viewer for GDSII layouts.',use:'Visualizing complex metal stacks.',gh:'https://github.com/trilomix/GDS3D'}
    ]},
    {title:'Layout Generators',tools:[
      {name:'gdspy',desc:'Python module for creating and modifying GDSII files.',use:'Programmatic GDSII generation.',gh:'https://github.com/heitzmann/gdspy',docs:'https://gdspy.readthedocs.io'},
      {name:'gdsfactory',desc:'Advanced Python library for generating GDSII layouts.',use:'Complex programmatic layouts and photonics.',gh:'https://github.com/gdsfactory/gdsfactory',docs:'https://gdsfactory.github.io/gdsfactory/'},
      {name:'OpenRAM',desc:'Python framework for automated SRAM generation.',use:'Generating custom SRAM macros.',gh:'https://github.com/VLSIDA/OpenRAM',web:'https://openram.org'}
    ]}
  ]},
  verif:{eye:'Stage 03B — Verification',title:'LVS & DRC',desc:'Ensuring the physical layout matches the schematic (LVS), extracting parasitics (PEX), and obeying electrical rules (ERC).',cats:[
    {title:'Verification Tools',tools:[
      {name:'Netgen',tags:['core'],desc:'The standard open-source LVS tool. Compares schematic against layout.',use:'Layout vs. Schematic verification.',gh:'https://github.com/RTimothyEdwards/netgen',web:'http://opencircuitdesign.com/netgen/'},
      {name:'klayout-pex',desc:'Parasitic extraction plugin for KLayout.',use:'Parasitic extraction from KLayout.',gh:'https://github.com/klayoutmatthias/klayout_pex'},
      {name:'CVC',desc:'Circuit Validity Checker. Performs Electrical Rules Checking (ERC).',use:'Electrical rule checking (ERC) prior to simulation.',gh:'https://github.com/d-m-bailey/cvc'}
    ]}
  ]},
  char:{eye:'Stage 04 — Characterization',title:'Characterization & Python',desc:'Automating simulation runs to generate standard cell libraries, extract models, or drive optimizations programmatically.',cats:[
    {title:'Characterization Tools',tools:[
      {name:'lctime',tags:['core'],desc:'Characterization kit for CMOS standard cells. Generates Liberty files.',use:'Standard cell timing characterization.',gh:'https://github.com/librecell/lctime'},
      {name:'CACE',desc:'Circuit Automatic Characterization Engine.',use:'Automated analog block characterization.',gh:'https://github.com/RTimothyEdwards/cace'},
      {name:'PyOPUS',desc:'Simulation driver and optimization tool for analog circuits.',use:'Analog circuit sizing and optimization.',web:'https://fides.fe.uni-lj.si/pyopus/'}
    ]},
    {title:'Python Frameworks',tools:[
      {name:'spicelib',desc:'Library for interacting with SPICE simulators from Python.',use:'Python scripting for SPICE tools.',gh:'https://github.com/nunobrum/spicelib',docs:'https://spicelib.readthedocs.io'},
      {name:'PySpice',desc:'Python interface for ngspice and Xyce.',use:'Python-based circuit definition and simulation.',gh:'https://github.com/FabriceSalvaire/PySpice',docs:'https://pyspice.fabrice-salvaire.fr'},
      {name:'ngspyce',desc:'Direct Python bindings to the ngspice shared library.',use:'High-performance Python integration with ngspice.',gh:'https://github.com/ignamv/ngspyce'},
      {name:'Hdl21',desc:'Analog Hardware Description Library in Python.',use:'Pythonic analog hardware description.',gh:'https://github.com/dan-fritchman/Hdl21'},
      {name:'pygmid',desc:'Python implementation of the gm/Id starter kit.',use:'gm/Id methodology sizing.',gh:'https://github.com/bmurmann/pygmid'}
    ]}
  ]},
  pdk:{eye:'Foundation — PDK & RF',title:'PDKs & RF Tools',desc:'The underlying technology process data and specialized tools for high-frequency electromagnetic analysis.',cats:[
    {title:'Process Design Kits',tools:[
      {name:'SkyWater SKY130 PDK',tags:['core'],desc:"The first open-source 130nm PDK from Google and SkyWater.",use:'Target technology for analog tape-outs.',gh:'https://github.com/google/skywater-pdk',docs:'https://skywater-pdk.readthedocs.io'},
      {name:'GF180MCU PDK',desc:'180nm CMOS PDK from GlobalFoundries.',use:'Alternative node for analog designs.',gh:'https://github.com/google/gf180mcu-pdk'},
      {name:'IHP SG13G2 PDK',desc:'130nm SiGe:C BiCMOS PDK from IHP.',use:'RF and high-speed mixed-signal design.',gh:'https://github.com/IHP-GmbH/IHP-Open-PDK'},
      {name:'Open_PDKs',desc:'Scripts for installing and configuring open-source PDKs.',use:'PDK installation and tool setup.',gh:'https://github.com/RTimothyEdwards/open_pdks'},
      {name:'volare',desc:'Version manager and builder for open-source PDKs.',use:'Managing PDK versions.',gh:'https://github.com/efabless/volare'}
    ]},
    {title:'RF & EM Utilities',tools:[
      {name:'RF Toolkit',desc:'Suite including FastHenry2, FasterCap, and openEMS.',use:'Electromagnetic extraction and simulation.',gh:'https://github.com/ediloren/FastHenry2'},
      {name:'scikit-rf',desc:'Python package for RF network analysis.',use:'RF data analysis and plotting.',gh:'https://github.com/scikit-rf/scikit-rf',docs:'https://scikit-rf.readthedocs.io'}
    ]}
  ]}
};

const analog: DomainPage = {
  slug: "analog-ic",
  intent: "accent",
  meta: {
    title: "Analog IC Tools",
    description:
      "Open-source tools for analog IC design — schematic capture, SPICE simulation, custom layout, extraction and LVS.",
  },
  hero: {
    eyebrow: "Open Source IC Toolchain",
    title: (
      <>
        Open Source
        <br />
        <em>Analog IC Design Tools</em>.
      </>
    ),
    body: "A carefully curated reference for analog engineers — covering schematic entry, SPICE simulation, custom layout, extraction, and LVS. All open source.",
    stats: [
      { value: "30+", label: "Tools indexed" },
      { value: "6", label: "Flow stages" },
      { value: "3", label: "Open PDKs" },
      { value: "100%", label: "Open source" },
    ],
  },
  references: {
    label: "Reference lists",
    title: "Start here",
    subtitle:
      "Before diving into individual tools, these curated lists give you the full landscape.",
    links: [
      {
        name: "foss-asic-tools",
        desc: "Efabless' comprehensive list of open-source ASIC tools spanning both Analog and Digital.",
        href: "https://github.com/efabless/foss-asic-tools",
      },
      {
        name: "IIC-OSIC-TOOLS",
        desc: "Pre-built Docker image packed with all necessary analog tools for SKY130/GF180.",
        href: "https://github.com/iic-jku/IIC-OSIC-TOOLS",
      },
    ],
  },
  flow: {
    label: "Interactive flow",
    title: "Analog Design Flow",
    subtitle:
      "Click any stage to see its tools, what they do, and when to use them.",
    rows: [
      {
        kind: "single",
        stage: {
          num: "01",
          name: "Schematic Entry",
          desc: "Drawing electrical schematics, defining components, connectivity, and parameters before moving to simulation.",
          count: "3 tools",
          panel: "schem",
        },
      },
      {
        kind: "single",
        stage: {
          num: "02",
          name: "SPICE Simulation",
          desc: "Pre-layout and post-layout circuit simulation using accurate device models. Evaluates DC, AC, and transient behavior.",
          count: "8 tools",
          panel: "sim",
        },
      },
      {
        kind: "parallel",
        stages: [
          {
            num: "03A",
            name: "Custom Layout & Routing",
            desc: "Translating the schematic into a physical mask layout manually or via automated generation scripts.",
            count: "6 tools",
            panel: "layout",
          },
          {
            num: "03B",
            name: "LVS & Verification",
            desc: "Ensuring layout matches schematic (LVS), obeys design rules (DRC), and extracting parasitics (PEX).",
            count: "3 tools",
            panel: "verif",
          },
        ],
      },
      {
        kind: "single",
        stage: {
          num: "04",
          name: "Characterization & Python",
          desc: "Automating simulation runs across PVT corners to generate standard cell libraries or drive circuit optimization.",
          count: "8 tools",
          panel: "char",
        },
      },
      {
        kind: "single",
        stage: {
          num: "◈",
          name: "Process Design Kits & RF",
          desc: "The underlying technology process data and specialized tools for high-frequency electromagnetic analysis.",
          count: "7 tools",
          panel: "pdk",
        },
      },
    ],
  },

  catalog: {
    label: "Complete reference",
    title: "Full tool catalog",
    subtitle: "Every analog tool indexed, filterable by stage.",
    filters: [
      { id: "all", label: "All" },
      { id: "schem", label: "Schematic" },
      { id: "sim", label: "Simulation" },
      { id: "wave", label: "Waveform" },
      { id: "layout", label: "Layout" },
      { id: "verif", label: "PEX & LVS" },
      { id: "char", label: "Characterization" },
      { id: "python", label: "Python" },
      { id: "rf", label: "RF & EM" },
      { id: "pdk", label: "PDK" },
    ],
    labels: {
      schem: "Schematic",
      sim: "Simulation",
      layout: "Layout",
      verif: "PEX & LVS",
      char: "Char/Model",
      python: "Python",
      rf: "RF & EM",
      wave: "Waveform",
      pdk: "PDK",
    },
    tools: catalogTools,
  },
  panels,
};

export default analog;
