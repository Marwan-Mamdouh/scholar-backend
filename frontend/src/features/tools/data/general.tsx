import {
  CatalogTool,
  DomainPage,
  StagePanelData,
} from "../tools.type";

const catalogTools: CatalogTool[] = [
  {cat:'build',name:'FuseSoC',core:true,desc:'Package manager and build tool for HDL projects. Manages dependencies and build flows for FPGA/ASIC using .core files.',use:'Dependency management and reproducible HDL builds.',gh:'https://github.com/olofk/fusesoc',docs:'https://fusesoc.readthedocs.io'},
  {cat:'build',name:'Edalize',desc:'Python library providing a unified interface to EDA tools — an abstraction layer supporting Icarus, Yosys, Verilator, Vivado, Quartus.',use:'Driving EDA tools from Python automation.',gh:'https://github.com/olofk/edalize',docs:'https://edalize.readthedocs.io'},
  {cat:'build',name:'SiliconCompiler',core:true,desc:'Modular build system for hardware. Wires up tools into a unified pipeline from RTL to GDS with a programmatic API.',use:'Building automated custom hardware pipelines.',gh:'https://github.com/siliconcompiler/siliconcompiler',web:'https://www.siliconcompiler.com',docs:'https://docs.siliconcompiler.com'},
  {cat:'build',name:'Qflow',desc:'Collection of useful conversion tools and scripts combining iverilog, Yosys, graywolf, and qrouter into a flow.',use:'Legacy or lightweight synthesis/P&R flows.',gh:'https://github.com/RTimothyEdwards/qflow',web:'http://opencircuitdesign.com/qflow/'},
  {cat:'env',name:'IIC-OSIC-TOOLS',core:true,desc:'All-in-one Docker image containing pre-installed open-source IC tools for SKY130, GF180, and IHP130. Maintained by JKU.',use:'Zero-setup open-source EDA environment.',gh:'https://github.com/iic-jku/IIC-OSIC-TOOLS'},
  {cat:'env',name:'volare',desc:'Version manager and builder for open-source PDKs. Easily install and switch between PDK versions.',use:'Managing PDK installations cleanly.',gh:'https://github.com/efabless/volare'},
  {cat:'env',name:'osic-multitool',desc:'Collection of useful scripts and documentation for open source IC tools from IIC-JKU.',use:'Utility scripts for managing EDA setups.',gh:'https://github.com/iic-jku/osic-multitool'},
  {cat:'lib',name:'libman',desc:'Design library manager for organizing cells and views. Links PDK cells with various tools systematically.',use:'Managing cell libraries across tools.',gh:'https://github.com/librecell/libman'},
  {cat:'format',name:'vlsirtools',core:true,desc:'Interchange formats for chip design. Provides common data models bridging analog and digital tools.',use:'Translating data between disparate EDA tools.',gh:'https://github.com/VLSIDA/vlsir'},
  {cat:'format',name:'PyRTL',desc:'Collection of classes for pythonic RTL design. Heavily used for teaching and rapid prototyping.',use:'Python-based RTL generation and teaching.',gh:'https://github.com/UCSBarchlab/PyRTL',docs:'https://pyrtl.readthedocs.io'},
  {cat:'format',name:'vlog2verilog',desc:'Verilog file conversion tool. Converts between different Verilog formats for improved tool compatibility.',use:'Fixing Verilog syntax compatibility issues.',gh:'https://github.com/RTimothyEdwards/vlog2verilog'},
  {cat:'wave',name:'surfer',core:true,desc:'Modern, fast waveform viewer built in Rust. Smooth interface, supports VCD and FST, highly extensible.',use:'High-performance waveform inspection.',gh:'https://github.com/surfer-project/surfer',web:'https://surfer-project.org'},
  {cat:'wave',name:'GTKWave',desc:'The classic open-source waveform viewer for VCD/FST. Used heavily across both digital and analog domains.',use:'Standard waveform viewing.',gh:'https://github.com/gtkwave/gtkwave',web:'https://gtkwave.sourceforge.net'},
  {cat:'util',name:'RgGen',core:true,desc:'Code generation tool for CSRs (Configuration/Status Registers). Generates SV RTL, UVM RAL models, and documentation.',use:'Automating register map implementation.',gh:'https://github.com/rggen/rggen',docs:'https://rggen.github.io/rggen-doc/'},
  {cat:'util',name:'padring',desc:'Padring generation tool. Automatically routes and generates the I/O ring around a chip core.',use:'Automated padframe generation.',gh:'https://github.com/YosysHQ/padring'},
  {cat:'sys',name:'PULP Platform Tools',core:true,desc:'Comprehensive suite including bender (package manager), morty (SV morpher), svase (SV elaborator), and sv2v.',use:'System-level SystemVerilog design and management.',gh:'https://github.com/pulp-platform/bender'},
  {cat:'sys',name:'RISC-V Toolchain',desc:'GNU compiler toolchain for RISC-V cores. Includes GCC, GDB, and Spike ISA simulator for software development.',use:'Compiling software for RISC-V targets.',gh:'https://github.com/riscv-collab/riscv-gnu-toolchain'},
  {cat:'sys',name:'riscv-pk',desc:'RISC-V Proxy Kernel and Bootloader. Runs Linux on RISC-V cores during simulation.',use:'Booting OS on RISC-V hardware models.',gh:'https://github.com/riscv-software-src/riscv-pk'},
  {cat:'gds',name:'gdsfactory',core:true,desc:'Powerful Python library for generating GDS layouts. Widely used in photonics and scripted analog layouts.',use:'Programmatic layout generation.',gh:'https://github.com/gdsfactory/gdsfactory',docs:'https://gdsfactory.github.io/gdsfactory/'},
  {cat:'gds',name:'OpenRAM',desc:'Free SRAM generator. Automatically creates full SRAM macros with GDS, schematics, and timing files.',use:'Generating memory macros for custom chips.',gh:'https://github.com/VLSIDA/OpenRAM',web:'https://openram.org'},
  {cat:'rtl',name:'Verible',core:true,desc:'SystemVerilog parser, linter, and formatter from Google. Essential for enforcing code quality across projects.',use:'Linting and formatting SystemVerilog.',gh:'https://github.com/chipsalliance/verible',docs:'https://chipsalliance.github.io/verible/'},
  {cat:'rtl',name:'sv2v',desc:'SystemVerilog to Verilog converter. Translates SV to plain Verilog for compatibility with older tools (like Yosys/Icarus).',use:'Converting SV for standard synthesis flows.',gh:'https://github.com/zachjs/sv2v'}
];

const panels: Record<string, StagePanelData> = {
  env:{eye:'Stage 01 — Setup',title:'Environment & Configuration',desc:'Managing the underlying EDA installation, Docker environments, and PDK versions. A solid environment is crucial before running any flows.',cats:[
    {title:'Environment Managers',tools:[
      {name:'IIC-OSIC-TOOLS',tags:['core'],desc:'All-in-one Docker image containing pre-installed open-source IC tools.',use:'Zero-setup open-source EDA environment.',gh:'https://github.com/iic-jku/IIC-OSIC-TOOLS'},
      {name:'volare',desc:'Version manager and builder for open-source PDKs.',use:'Managing PDK installations cleanly.',gh:'https://github.com/efabless/volare'},
      {name:'osic-multitool',desc:'Collection of useful scripts and documentation for open source IC tools.',use:'Utility scripts for managing EDA setups.',gh:'https://github.com/iic-jku/osic-multitool'}
    ]},
    {title:'Libraries',tools:[
      {name:'libman',desc:'Design library manager for organizing cells and views.',use:'Managing cell libraries across tools.',gh:'https://github.com/librecell/libman'}
    ]}
  ]},
  build:{eye:'Stage 02 — Automation',title:'Build Systems & Package Mgmt',desc:'Automating the execution of EDA tools, tracking dependencies, and building reproducible hardware flows from RTL to GDS.',cats:[
    {title:'Build Tools',tools:[
      {name:'FuseSoC',tags:['core'],desc:'Package manager and build tool for HDL projects.',use:'Dependency management and reproducible HDL builds.',gh:'https://github.com/olofk/fusesoc',docs:'https://fusesoc.readthedocs.io'},
      {name:'SiliconCompiler',tags:['core'],desc:'Modular build system wiring up tools into a unified pipeline.',use:'Building automated custom hardware pipelines.',gh:'https://github.com/siliconcompiler/siliconcompiler',web:'https://www.siliconcompiler.com',docs:'https://docs.siliconcompiler.com'},
      {name:'Edalize',desc:'Python library providing a unified interface to EDA tools.',use:'Driving EDA tools from Python automation.',gh:'https://github.com/olofk/edalize',docs:'https://edalize.readthedocs.io'},
      {name:'Qflow',desc:'Collection of useful conversion tools and scripts.',use:'Legacy or lightweight synthesis/P&R flows.',gh:'https://github.com/RTimothyEdwards/qflow',web:'http://opencircuitdesign.com/qflow/'}
    ]}
  ]},
  sys:{eye:'Stage 03A — System',title:'System Level & Software',desc:'Tools for system-level design, software cross-compilation, and high-level structural manipulation.',cats:[
    {title:'System Tools',tools:[
      {name:'PULP Platform Tools',tags:['core'],desc:'Comprehensive suite including bender, morty, svase, and sv2v.',use:'System-level SystemVerilog design and management.',gh:'https://github.com/pulp-platform/bender'},
      {name:'RISC-V Toolchain',desc:'GNU compiler toolchain for RISC-V cores. Includes GCC, GDB, and Spike.',use:'Compiling software for RISC-V targets.',gh:'https://github.com/riscv-collab/riscv-gnu-toolchain'},
      {name:'riscv-pk',desc:'RISC-V Proxy Kernel and Bootloader.',use:'Booting OS on RISC-V hardware models.',gh:'https://github.com/riscv-software-src/riscv-pk'}
    ]}
  ]},
  format:{eye:'Stage 03B — Code',title:'RTL Utilities & Formats',desc:'Linters, formatters, and interchange formats bridging different steps of the design process.',cats:[
    {title:'RTL Manipulation',tools:[
      {name:'Verible',tags:['core'],desc:'SystemVerilog parser, linter, and formatter from Google.',use:'Linting and formatting SystemVerilog.',gh:'https://github.com/chipsalliance/verible',docs:'https://chipsalliance.github.io/verible/'},
      {name:'sv2v',desc:'SystemVerilog to Verilog converter.',use:'Converting SV for standard synthesis flows.',gh:'https://github.com/zachjs/sv2v'},
      {name:'PyRTL',desc:'Collection of classes for pythonic RTL design.',use:'Python-based RTL generation and teaching.',gh:'https://github.com/UCSBarchlab/PyRTL',docs:'https://pyrtl.readthedocs.io'},
      {name:'vlog2verilog',desc:'Verilog file conversion tool.',use:'Fixing Verilog syntax compatibility issues.',gh:'https://github.com/RTimothyEdwards/vlog2verilog'}
    ]},
    {title:'Interchange',tools:[
      {name:'vlsirtools',tags:['core'],desc:'Interchange formats for chip design.',use:'Translating data between disparate EDA tools.',gh:'https://github.com/VLSIDA/vlsir'}
    ]}
  ]},
  wave:{eye:'Stage 04 — Debug',title:'Waveform Viewers',desc:'Standalone tools for visualizing simulation results, debugging signals, and performing timing analysis visually.',cats:[
    {title:'Viewers',tools:[
      {name:'surfer',tags:['core'],desc:'Modern, fast waveform viewer built in Rust.',use:'High-performance waveform inspection.',gh:'https://github.com/surfer-project/surfer',web:'https://surfer-project.org'},
      {name:'GTKWave',desc:'The classic open-source waveform viewer for VCD/FST.',use:'Standard waveform viewing.',gh:'https://github.com/gtkwave/gtkwave',web:'https://gtkwave.sourceforge.net'}
    ]}
  ]},
  util:{eye:'Foundation — Generators',title:'Code & Layout Generators',desc:'Automated generators for specific macro types like SRAM, CSRs, or pad rings, as well as general layout APIs.',cats:[
    {title:'Code Generation',tools:[
      {name:'RgGen',tags:['core'],desc:'Code generation tool for CSRs (Configuration/Status Registers).',use:'Automating register map implementation.',gh:'https://github.com/rggen/rggen',docs:'https://rggen.github.io/rggen-doc/'},
      {name:'padring',desc:'Padring generation tool.',use:'Automated padframe generation.',gh:'https://github.com/YosysHQ/padring'}
    ]},
    {title:'GDS Utilities',tools:[
      {name:'gdsfactory',tags:['core'],desc:'Powerful Python library for generating GDS layouts.',use:'Programmatic layout generation.',gh:'https://github.com/gdsfactory/gdsfactory',docs:'https://gdsfactory.github.io/gdsfactory/'},
      {name:'OpenRAM',desc:'Free SRAM generator. Automatically creates full SRAM macros.',use:'Generating memory macros for custom chips.',gh:'https://github.com/VLSIDA/OpenRAM',web:'https://openram.org'}
    ]}
  ]}
};

const general: DomainPage = {
  slug: "general-ic",
  intent: "primary",
  meta: {
    title: "General & Infrastructure IC Tools",
    description:
      "The glue of the open-source IC toolchain — environment setup, build systems, PDK management, interchange formats and system-level utilities.",
  },
  hero: {
    eyebrow: "Open Source IC Toolchain",
    title: (
      <>
        General & Infrastructure
        <br />
        <em>open-source IC tools</em>.
      </>
    ),
    body: "The essential glue of the IC toolchain — covering environment setup, build systems, PDK management, interchange formats, and system-level utilities. All open source.",
    stats: [
      { value: "20+", label: "Tools indexed" },
      { value: "6", label: "Flow stages" },
      { value: "1", label: "Unified ecosystem" },
      { value: "100%", label: "Open source" },
    ],
  },
  references: {
    label: "Reference lists",
    title: "Start here",
    subtitle:
      "Before diving into individual tools, these resources outline the full open-source silicon ecosystem.",
    links: [
      {
        name: "foss-asic-tools",
        desc: "The most comprehensive reference for all open-source ASIC tools — Analog and Digital.",
        href: "https://github.com/efabless/foss-asic-tools",
      },
      {
        name: "IIC-OSIC-TOOLS",
        desc: "A complete Docker image containing every pre-configured open-source EDA tool you need.",
        href: "https://github.com/iic-jku/IIC-OSIC-TOOLS",
      },
      {
        name: "Open Source Silicon Slack",
        desc: "The central community hub for open-source chip design — start here to ask questions.",
        href: "https://open-source-silicon.slack.com/",
      },
    ],
  },
  flow: {
    label: "Interactive flow",
    title: "General Toolchain Flow",
    subtitle:
      "Click any stage to see its tools, what they do, and when to use them.",
    rows: [
      {
        kind: "single",
        stage: {
          num: "01",
          name: "Environment & Configuration",
          desc: "Managing the underlying EDA installation, Docker environments, and PDK versions properly.",
          count: "4 tools",
          panel: "env",
        },
      },
      {
        kind: "single",
        stage: {
          num: "02",
          name: "Build Systems & Package Mgmt",
          desc: "Automating the execution of EDA tools, tracking dependencies, and building reproducible hardware flows.",
          count: "4 tools",
          panel: "build",
        },
      },
      {
        kind: "parallel",
        stages: [
          {
            num: "03A",
            name: "System Level & Software",
            desc: "Tools for system-level design, RISC-V software cross-compilation, and structural manipulation.",
            count: "3 tools",
            panel: "sys",
          },
          {
            num: "03B",
            name: "RTL Utilities & Formats",
            desc: "Linters, formatters, and interchange formats bridging disparate tools in the design process.",
            count: "5 tools",
            panel: "format",
          },
        ],
      },
      {
        kind: "single",
        stage: {
          num: "04",
          name: "Waveform Viewers",
          desc: "Standalone tools for visualizing simulation results, debugging signals, and performing timing analysis visually.",
          count: "2 tools",
          panel: "wave",
        },
      },
      {
        kind: "single",
        stage: {
          num: "◈",
          name: "Code & Layout Generators",
          desc: "Automated generators for specific macro types like SRAM, CSRs, pad rings, and general layout scripts.",
          count: "4 tools",
          panel: "util",
        },
      },
    ],
  },

  catalog: {
    label: "Complete reference",
    title: "Full tool catalog",
    subtitle: "Every general tool indexed, filterable by stage.",
    filters: [
      { id: "all", label: "All" },
      { id: "env", label: "Environment" },
      { id: "build", label: "Build Systems" },
      { id: "sys", label: "System Level" },
      { id: "rtl", label: "RTL Utils" },
      { id: "format", label: "Formats" },
      { id: "wave", label: "Waveform" },
      { id: "util", label: "Code Gen" },
      { id: "gds", label: "GDS Utils" },
    ],
    labels: {
      env: "Environment",
      lib: "Libraries",
      build: "Build System",
      format: "Formats",
      wave: "Waveform",
      util: "Code Gen",
      sys: "System",
      gds: "GDS Utils",
      rtl: "RTL Utils",
    },
    tools: catalogTools,
  },
  panels,
};

export default general;
