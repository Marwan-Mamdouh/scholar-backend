import {
  CatalogTool,
  DomainPage,
  StagePanelData,
} from "../tools.type";

const catalogTools: CatalogTool[] = [
  {cat:'sim',name:'Icarus Verilog',core:true,desc:'The most widely used open-source Verilog simulator. Compiles Verilog to bytecode and runs it. Reliable, fast to set up, and compatible with every open-source flow.',use:'First stop for functional RTL simulation.',gh:'https://github.com/steveicarus/iverilog',web:'http://iverilog.icarus.com'},
  {cat:'sim',name:'Verilator',desc:'Translates Verilog/SystemVerilog RTL into a cycle-accurate C++ model — orders of magnitude faster than interpreted simulation. The go-to for large SoCs and co-simulation.',use:'High-speed simulation and C/C++ co-simulation.',gh:'https://github.com/verilator/verilator',web:'https://verilator.org',docs:'https://verilator.org/guide/latest/'},
  {cat:'sim',name:'GHDL',desc:'Open-source VHDL simulator with full VHDL-2008 support. Can be linked into Yosys for VHDL synthesis workflows.',use:'VHDL simulation and synthesis prep.',gh:'https://github.com/ghdl/ghdl',web:'https://ghdl.github.io/ghdl/'},
  {cat:'sim',name:'GTKWave',desc:'The standard open-source waveform viewer for VCD and FST files. Inspect signals, add cursors, measure time.',use:'Post-simulation waveform debugging.',gh:'https://github.com/gtkwave/gtkwave',web:'https://gtkwave.sourceforge.net'},
  {cat:'sim',name:'cocotb',core:true,desc:'Python-based testbench framework plugging into any simulator. Write async testbenches in pure Python — the open-source UVM replacement.',use:'Structured, reusable testbenches in Python.',gh:'https://github.com/cocotb/cocotb',web:'https://www.cocotb.org',docs:'https://docs.cocotb.org'},
  {cat:'sim',name:'pyuvm',desc:'Full UVM implemented in Python on top of cocotb — phasing, components, sequences, scoreboards without SystemVerilog.',use:'UVM-methodology verification using Python.',gh:'https://github.com/pyuvm/pyuvm'},
  {cat:'sim',name:'VUnit',desc:'Unit testing framework for VHDL and SystemVerilog with CI support and automated regression.',use:'Automated regression testing and CI pipelines.',gh:'https://github.com/VUnit/vunit',web:'https://vunit.github.io'},
  {cat:'sim',name:'OSVVM',desc:'Open Source VHDL Verification Methodology — functional coverage, constrained random, scoreboards. The VHDL counterpart to UVM.',use:'Full VHDL verification methodology.',gh:'https://github.com/OSVVM/OsvvmLibraries',web:'https://osvvm.org'},
  {cat:'sim',name:'MCY',desc:'Mutation coverage tool from YosysHQ. Injects RTL mutations to measure how many bugs your testbench actually catches.',use:'Quantifying testbench completeness.',gh:'https://github.com/YosysHQ/mcy',docs:'https://mcy.readthedocs.io'},
  {cat:'sim',name:'PyMTL3',desc:'Python framework for hardware modeling, simulation, and verification from Cornell. Full stack: model → simulate → verify.',use:'Research-grade hardware modeling.',gh:'https://github.com/pymtl/pymtl3'},
  {cat:'synth',name:'Yosys',core:true,desc:'The cornerstone of open-source synthesis. Parses Verilog-2005 and much of SystemVerilog, optimizes logic, maps to standard cells. Used in virtually every open-source ASIC and FPGA flow.',use:'RTL → gate-level netlist with technology mapping.',gh:'https://github.com/YosysHQ/yosys',web:'https://yosyshq.net/yosys/',docs:'https://yosys.readthedocs.io'},
  {cat:'synth',name:'OSS CAD Suite',desc:'Pre-built nightly bundle: Yosys, SymbiYosys, nextpnr, all SMT solvers, and more. One download, everything works.',use:'Instant setup of the full open-source EDA toolchain.',gh:'https://github.com/YosysHQ/oss-cad-suite-build'},
  {cat:'synth',name:'ABC',desc:'Logic synthesis and verification from UC Berkeley. Used internally by Yosys for technology mapping, retiming, and sequential optimization.',use:'Gate-level logic optimization and mapping.',gh:'https://github.com/berkeley-abc/abc'},
  {cat:'synth',name:'Surelog + UHDM',desc:'Full SystemVerilog 2017 parser and elaborator that improves SV support inside Verilator and Yosys. Critical for SV-heavy designs.',use:'Correct elaboration of complex SystemVerilog code.',gh:'https://github.com/chipsalliance/Surelog'},
  {cat:'formal',name:'SymbiYosys (sby)',core:true,desc:'The primary open-source formal verification front-end. Parses RTL via Yosys, then drives SMT/SAT solver backends. Supports BMC, k-induction, and cover analysis.',use:'Running formal property checks on RTL assertions.',gh:'https://github.com/YosysHQ/sby',docs:'https://symbiyosys.readthedocs.io'},
  {cat:'formal',name:'Z3 Solver',core:true,desc:'The most widely deployed SMT solver, from Microsoft Research. Supports all major SMT-LIB theories. Powers SymbiYosys and countless other formal tools.',use:'Core formal reasoning engine behind most FV tools.',gh:'https://github.com/Z3Prover/z3',docs:'https://z3prover.github.io/api/html/z3.html'},
  {cat:'formal',name:'Boolector',desc:'SMT solver specialized in Bit-Vector and Array theories — purpose-built for hardware formal verification.',use:'Bit-precise SMT solving for hardware properties.',gh:'https://github.com/Boolector/boolector',web:'https://boolector.github.io'},
  {cat:'formal',name:'Yices 2',desc:'Fast SMT solver from SRI International. The default solver in SymbiYosys, with strong performance on hardware benchmarks.',use:'Default SMT backend for SymbiYosys.',gh:'https://github.com/SRI-CSL/yices2',web:'https://yices.csl.sri.com'},
  {cat:'formal',name:'EBMC / CBMC',desc:'Bounded model checker for hardware and C. Proves absence of specific bug classes via exhaustive bounded analysis.',use:'Formal model checking for RTL and C-based hardware.',gh:'https://github.com/diffblue/cbmc',web:'https://www.cprover.org/ebmc/'},
  {cat:'formal',name:'riscv-formal',desc:'Formal verification framework for RISC-V cores using SymbiYosys. Tests ISA compliance at the instruction level.',use:'Formally verifying RISC-V core correctness.',gh:'https://github.com/YosysHQ/riscv-formal'},
  {cat:'formal',name:'MiniSat',desc:'Compact, efficient SAT solver — the foundational engine behind many formal verification and EDA tools.',use:'Core SAT solving underlying formal methods.',gh:'https://github.com/niklasso/minisat',web:'http://minisat.se'},
  {cat:'formal',name:'CaDiCaL',desc:'Modern high-performance SAT solver with excellent results on hardware benchmarks. Used as a backend by Boolector.',use:'State-of-the-art SAT solving for large problems.',gh:'https://github.com/arminbiere/cadical'},
  {cat:'pnr',name:'OpenLane / LibreLane',core:true,desc:'The most popular automated RTL-to-GDSII flow. Integrates Yosys, OpenROAD, Magic, and Netgen into a CI-ready pipeline for SKY130 and GF180.',use:'Complete push-button flow from RTL to tape-out GDSII.',gh:'https://github.com/The-OpenROAD-Project/OpenLane',docs:'https://openlane.readthedocs.io'},
  {cat:'pnr',name:'OpenROAD',desc:'No-human-in-the-loop physical implementation tool: floorplanning, placement, CTS, routing, and timing — all open source.',use:'Automated physical design from netlist to routed layout.',gh:'https://github.com/The-OpenROAD-Project/OpenROAD',web:'https://theopenroadproject.org'},
  {cat:'pnr',name:'Magic VLSI',desc:'Open-source VLSI layout editor with interactive DRC and LVS for open PDKs. One of the longest-running open EDA tools.',use:'Layout editing, DRC, and LVS verification.',gh:'https://github.com/RTimothyEdwards/magic',web:'http://opencircuitdesign.com/magic/'},
  {cat:'pnr',name:'KLayout',desc:'Professional layout viewer and editor for GDSII. DRC scripting in Python or Ruby. Widely used for tape-out review.',use:'GDSII inspection, DRC scripting, layout editing.',gh:'https://github.com/KLayout/klayout',web:'https://www.klayout.de'},
  {cat:'pnr',name:'Qflow',desc:'Lightweight complete Verilog-to-layout toolchain: iverilog + Yosys + graywolf + qrouter.',use:'Lightweight alternative RTL-to-layout flow.',gh:'https://github.com/RTimothyEdwards/qflow',web:'http://opencircuitdesign.com/qflow/'},
  {cat:'pnr',name:'Netgen (LVS)',desc:'LVS tool comparing the routed netlist to the schematic — confirms the layout matches the intended design.',use:'Layout vs. Schematic verification before tape-out.',gh:'https://github.com/RTimothyEdwards/netgen'},
  {cat:'pdk',name:'SkyWater SKY130 PDK',core:true,desc:"The world's first open-source PDK, from Google and SkyWater Technology. 130nm CMOS. The standard for all open ASIC tape-outs and the Efabless chipIgnite program.",use:'Technology library for all open-source ASIC flows.',gh:'https://github.com/google/skywater-pdk',docs:'https://skywater-pdk.readthedocs.io'},
  {cat:'pdk',name:'GF180MCU PDK',desc:'180nm CMOS PDK from GlobalFoundries, open-sourced by Google. More mature node with wider standard cell options.',use:'Alternative process node for open designs.',gh:'https://github.com/google/gf180mcu-pdk'},
  {cat:'pdk',name:'IHP SG13G2 PDK',desc:'Open-source 130nm BiCMOS PDK from IHP Microelectronics — supports both digital CMOS and analog/RF design.',use:'Mixed-signal and RF design in the open ecosystem.',gh:'https://github.com/IHP-GmbH/IHP-Open-PDK'},
  {cat:'pdk',name:'Open_PDKs',desc:'Installation and management scripts for all open-source PDKs by Tim Edwards. Handles tool-PDK compatibility automatically.',use:'Installing and configuring open PDKs.',gh:'https://github.com/RTimothyEdwards/open_pdks'},
  {cat:'pdk',name:'Efabless / chipIgnite',desc:'The leading platform for open-source chip manufacturing — submit your RTL and receive a real chip on SKY130, at no cost.',use:'Taking your open-source design to actual silicon.',web:'https://efabless.com',gh:'https://github.com/efabless'},
  {cat:'sta',name:'OpenTimer',desc:'High-performance STA engine in C++17, built on parallel incremental timing. Supports .lib, SPEF, and SDC.',use:'Pre- and post-layout static timing analysis.',gh:'https://github.com/OpenTimer/OpenTimer'},
  {cat:'sta',name:'OpenSTA',desc:'Open-source STA tool integrated into OpenROAD. The standard timing engine in OpenLane. Supports SDC.',use:'Timing analysis within OpenROAD and OpenLane.',gh:'https://github.com/The-OpenROAD-Project/OpenSTA'},
  {cat:'hdl',name:'Verible',desc:'SystemVerilog parser, linter, and formatter from Google/ChipsAlliance. The essential code quality tool for any professional SV project.',use:'RTL linting, formatting, and style enforcement.',gh:'https://github.com/chipsalliance/verible'},
  {cat:'hdl',name:'PyVerilog',desc:'Python toolkit for Verilog analysis — parser, dataflow analyzer, and code generator. Useful for design automation scripts.',use:'Automated Verilog processing and analysis.',gh:'https://github.com/PyHDI/Pyverilog'},
  {cat:'hdl',name:'Chisel',desc:'Hardware Construction Language in Scala that generates clean Verilog. Widely used for parameterized hardware generators and RISC-V projects.',use:'Generating parameterized RTL from Scala.',gh:'https://github.com/chipsalliance/chisel',web:'https://www.chisel-lang.org'},
  {cat:'hdl',name:'Amaranth HDL',desc:'Python-based HDL generating Verilog or RTLIL. Modern, well-typed API. Fully supported in OSS CAD Suite.',use:'Python-native RTL design.',gh:'https://github.com/amaranth-lang/amaranth',docs:'https://amaranth-lang.org/docs/amaranth/'},
  {cat:'hdl',name:'LegUp HLS',desc:'High-Level Synthesis from C to FPGA/ASIC from University of Toronto. Bridges software algorithms and hardware.',use:'Synthesizing C algorithms into hardware.',gh:'https://github.com/ljhsiun2/legup',web:'http://legup.eecg.utoronto.ca'},
  {cat:'hdl',name:'ROHD',desc:'Rapid Open Hardware Design framework in Dart from Intel, with an integrated verification framework.',use:'Modern hardware design and verification in Dart.',gh:'https://github.com/intel/rohd'},
  {cat:'build',name:'FuseSoC',core:true,desc:'Package manager and build tool for HDL projects. Manages dependencies and build flows for FPGA and ASIC targets — like npm, but for hardware.',use:'Dependency management and reproducible HDL builds.',gh:'https://github.com/olofk/fusesoc',docs:'https://fusesoc.readthedocs.io'},
  {cat:'build',name:'Edalize',desc:'Python library providing a unified interface to EDA tools — supports Icarus, Yosys, Verilator, Vivado, Quartus from one API.',use:'Driving any EDA tool from Python automation.',gh:'https://github.com/olofk/edalize'},
  {cat:'build',name:'IIC-OSIC-TOOLS',desc:'Ready-to-use Docker image with every open-source IC tool for SKY130, GF180, and IHP130. Supports AMD64 and ARM64. From JKU Austria.',use:'Zero-setup open-source ASIC environment.',gh:'https://github.com/iic-jku/IIC-OSIC-TOOLS'},
  {cat:'build',name:'RgGen',desc:'Generates CSR RTL and UVM RAL models from a register spec file. Eliminates hand-coding of register banks.',use:'Automating CSR RTL and verification model generation.',gh:'https://github.com/rggen/rggen'},
  {cat:'fpga',name:'nextpnr',desc:'Open-source place and route for Lattice iCE40, ECP5, and Gowin FPGAs. Works with Yosys for a complete open FPGA toolchain.',use:'Placing and routing netlist onto FPGAs.',gh:'https://github.com/YosysHQ/nextpnr'},
  {cat:'fpga',name:'Project IceStorm',desc:'Reverse-engineered open toolchain for the Lattice iCE40 — the first FPGA with a fully open-source bitstream and toolchain.',use:'Complete open-source flow for iCE40 FPGAs.',gh:'https://github.com/YosysHQ/icestorm',web:'http://bygone.clairexen.net/icestorm/'},
  {cat:'fpga',name:'VTR',desc:'Complete FPGA CAD research flow from University of Toronto: ODIN-II + ABC + VPR for synthesis, mapping, and place-and-route.',use:'Academic FPGA research and RTL-to-bitstream.',gh:'https://github.com/verilog-to-routing/vtr-verilog-to-routing'},
  {cat:'online',name:'EDA Playground',desc:'Free online simulator for Verilog, SystemVerilog, and VHDL. Includes commercial simulators (VCS, Cadence) and open-source options. No install needed.',use:'Quick RTL simulation and code sharing.',web:'https://www.edaplayground.com'},
  {cat:'online',name:'Makerchip',desc:'Online IDE for Verilog and TL-Verilog from Redwood EDA — free, with built-in waveform viewer. Ideal for learning.',use:'Browser-based RTL development.',web:'https://www.makerchip.com'},
  {cat:'online',name:'OpenCores',desc:"The largest library of open-source IP cores — thousands of processor, interface, DSP, and memory controller designs.",use:'Sourcing pre-verified IP cores for your design.',web:'https://opencores.org'},
];

const panels: Record<string, StagePanelData> = {
  spec:{eye:'Stage 01 — Specification',title:'Specification & Architecture',desc:'Before writing a line of RTL, the design must be fully specified. This stage establishes functional requirements, performance targets, interface protocols, power budgets, and micro-architecture decisions. The outputs are the documents every subsequent stage works from.',cats:[{title:'Reference & Planning',tools:[{name:'Awesome ASIC Resources',tags:['start here'],desc:'The single best starting point for any open-source ASIC project — a curated list by Matt Venn.',use:'Understanding what tools exist before starting.',gh:'https://github.com/mattvenn/awesome-opensource-asic-resources'},{name:'EDA Collection',desc:'Flow-organized list of EDA tools with descriptions and links.',use:'Quick lookup of which tool handles a specific task.',gh:'https://github.com/pkuzjx/eda-collection'}]},{title:'Register Map & Interface Spec',tools:[{name:'RgGen',tags:['code gen'],desc:'Generates CSR RTL and UVM RAL models from a SystemRDL or YAML register specification. Eliminates hand-coding of register banks.',use:'Translating a register spec into RTL and verification models automatically.',gh:'https://github.com/rggen/rggen'},{name:'SystemRDL',desc:'Industry-standard language for specifying register maps. Tool-independent and portable.',use:'Authoring formally defined, portable register specifications.',web:'https://www.accellera.org/downloads/standards/systemrdl'}]}]},
  hdl:{eye:'Stage 02 — RTL Design',title:'RTL Design & HDL Coding',desc:'The architecture is translated into synthesizable RTL code. This can be traditional HDL (Verilog, SV, VHDL) or higher-abstraction generators that produce RTL as output — giving better parameterization and reuse.',cats:[{title:'Traditional HDLs',tools:[{name:'Verilog / SystemVerilog',tags:['standard'],desc:'The dominant HDLs in industry. SV adds powerful verification constructs and improved type safety over Verilog.',use:'Writing synthesizable RTL and behavioral simulation code.'},{name:'GHDL',tags:['vhdl'],desc:'Open-source VHDL simulator with VHDL-2008 support. Can interface with Yosys for synthesis.',use:'VHDL RTL development.',gh:'https://github.com/ghdl/ghdl',web:'https://ghdl.github.io/ghdl/'},{name:'Verible',tags:['linter'],desc:'SystemVerilog parser, linter, and formatter from Google. Enforces coding conventions and catches style issues early.',use:'Code quality enforcement and automated formatting.',gh:'https://github.com/chipsalliance/verible'},{name:'Surelog + UHDM',tags:['sv parser'],desc:'Full SystemVerilog 2017 parser/elaborator improving SV support in Verilator and Yosys.',use:'Correct elaboration of complex SystemVerilog designs.',gh:'https://github.com/chipsalliance/Surelog'}]},{title:'Hardware Construction Languages',tools:[{name:'Chisel',tags:['scala'],desc:'Hardware Construction Language in Scala that generates clean, readable Verilog. Widely used in the RISC-V ecosystem.',use:'Parameterized hardware generators and reusable IP.',gh:'https://github.com/chipsalliance/chisel',web:'https://www.chisel-lang.org'},{name:'Amaranth HDL',tags:['python'],desc:'Python-based HDL targeting Verilog/RTLIL. Clean modern API with strong typing.',use:'Python-native RTL design.',gh:'https://github.com/amaranth-lang/amaranth',docs:'https://amaranth-lang.org/docs/amaranth/'},{name:'LegUp HLS',tags:['hls'],desc:'High-Level Synthesis from C to FPGA/ASIC from University of Toronto.',use:'Translating C algorithms directly to hardware.',gh:'https://github.com/ljhsiun2/legup',web:'http://legup.eecg.utoronto.ca'},{name:'ROHD',tags:['dart'],desc:'Rapid Open Hardware Design in Dart from Intel, with an integrated verification framework.',use:'Hardware design and verification in Dart.',gh:'https://github.com/intel/rohd'}]}]},
  sim:{eye:'Stage 03A — Simulation',title:'Simulation & Dynamic Verification',desc:'RTL is exercised with directed and constrained-random testbenches. Coverage models drive stimulus until all corner cases are hit. Runs in parallel with formal verification — together they close the verification gap.',cats:[{title:'RTL Simulators',tools:[{name:'Icarus Verilog',tags:['core'],desc:'Most widely used open-source Verilog simulator. Simple, reliable, universally compatible.',use:'Functional RTL simulation.',gh:'https://github.com/steveicarus/iverilog',web:'http://iverilog.icarus.com'},{name:'Verilator',tags:['fast'],desc:'Converts RTL to a cycle-accurate C++ model — orders of magnitude faster. Essential for large SoC simulation.',use:'High-speed simulation and C++ co-simulation.',gh:'https://github.com/verilator/verilator',web:'https://verilator.org',docs:'https://verilator.org/guide/latest/'},{name:'GHDL',tags:['vhdl'],desc:'Open-source VHDL simulator with VHDL-2008 support.',use:'VHDL simulation.',gh:'https://github.com/ghdl/ghdl'},{name:'GTKWave',tags:['viewer'],desc:'Industry-standard waveform viewer for VCD/FST files.',use:'Post-simulation waveform analysis.',gh:'https://github.com/gtkwave/gtkwave',web:'https://gtkwave.sourceforge.net'}]},{title:'Verification Frameworks',tools:[{name:'cocotb',tags:['core','python'],desc:'Python testbench framework working with any simulator. The open-source alternative to UVM.',use:'Writing reusable, Pythonic testbenches.',gh:'https://github.com/cocotb/cocotb',web:'https://www.cocotb.org',docs:'https://docs.cocotb.org'},{name:'pyuvm',tags:['uvm'],desc:'Full UVM in Python on top of cocotb — phasing, components, sequences, scoreboards.',use:'UVM-compliant verification without SystemVerilog.',gh:'https://github.com/pyuvm/pyuvm'},{name:'VUnit',tags:['sv','vhdl'],desc:'Unit testing framework for HDL with CI integration.',use:'Regression testing and CI/CD for HDL.',gh:'https://github.com/VUnit/vunit',web:'https://vunit.github.io'},{name:'OSVVM',tags:['vhdl'],desc:'VHDL Verification Methodology — coverage, constrained random, scoreboards.',use:'Full VHDL verification methodology.',gh:'https://github.com/OSVVM/OsvvmLibraries',web:'https://osvvm.org'},{name:'MCY',tags:['mutation'],desc:'Measures testbench quality by injecting RTL mutations and checking if tests catch them.',use:'Quantifying verification completeness.',gh:'https://github.com/YosysHQ/mcy',docs:'https://mcy.readthedocs.io'},{name:'PyMTL3',tags:['research'],desc:'Python hardware modeling, simulation, and verification from Cornell.',use:'Research-grade hardware simulation.',gh:'https://github.com/pymtl/pymtl3'}]}]},
  formal:{eye:'Stage 03B — Formal Verification',title:'Formal Property Verification',desc:'Mathematical methods prove your design satisfies its properties for every possible input — not just tested ones. Formal catches bugs simulation can never find, and runs in parallel with the simulation effort.',cats:[{title:'Formal Frontends',tools:[{name:'SymbiYosys (sby)',tags:['core'],desc:'The main open-source formal front-end. Parses RTL via Yosys, drives SMT/SAT backends. Supports BMC, k-induction, and cover analysis.',use:'Running formal assertion checks and equivalence checking on RTL.',gh:'https://github.com/YosysHQ/sby',docs:'https://symbiyosys.readthedocs.io'},{name:'riscv-formal',desc:'Formal framework for RISC-V cores using SymbiYosys — tests ISA compliance at instruction level.',use:'Formally proving RISC-V core correctness.',gh:'https://github.com/YosysHQ/riscv-formal'},{name:'EBMC / CBMC',desc:'Bounded model checker for hardware and C. Proves absence of bug classes through exhaustive analysis.',use:'Formal model checking for RTL and C.',gh:'https://github.com/diffblue/cbmc',web:'https://www.cprover.org/ebmc/'}]},{title:'SMT Solvers',tools:[{name:'Z3 Solver',tags:['core'],desc:'The most widely deployed SMT solver. Supports all SMT-LIB theories. The engine behind most formal tools.',use:'Core reasoning engine for formal verification.',gh:'https://github.com/Z3Prover/z3',docs:'https://z3prover.github.io/api/html/z3.html'},{name:'Boolector',desc:'SMT solver specialized in Bit-Vector and Array theories. Purpose-built for hardware.',use:'Bit-precise hardware formal verification.',gh:'https://github.com/Boolector/boolector',web:'https://boolector.github.io'},{name:'Yices 2',desc:'Fast SMT solver from SRI International. Default solver in SymbiYosys.',use:'General SMT solving backend.',gh:'https://github.com/SRI-CSL/yices2',web:'https://yices.csl.sri.com'}]},{title:'SAT Solvers',tools:[{name:'MiniSat',desc:'Compact, efficient SAT solver — the foundational engine behind many EDA tools.',use:'Core satisfiability solving.',gh:'https://github.com/niklasso/minisat',web:'http://minisat.se'},{name:'CaDiCaL',desc:'Modern high-performance SAT solver. State-of-the-art on hardware benchmarks.',use:'High-performance SAT solving for large problems.',gh:'https://github.com/arminbiere/cadical'}]}]},
  synth:{eye:'Stage 04 — Synthesis',title:'Logic Synthesis',desc:'RTL is compiled into a technology-mapped gate-level netlist. Synthesis performs logic minimization, technology mapping, retiming, and optimization for area, timing, and power — producing the input that physical implementation tools consume.',cats:[{title:'Synthesis Tools',tools:[{name:'Yosys',tags:['core'],desc:'The cornerstone open-source synthesis framework. Parses Verilog and much of SystemVerilog, optimizes, maps to standard cells. The backbone of virtually every open-source ASIC flow.',use:'RTL to gate-level netlist — technology mapping and optimization.',gh:'https://github.com/YosysHQ/yosys',web:'https://yosyshq.net/yosys/',docs:'https://yosys.readthedocs.io'},{name:'ABC',desc:'Logic synthesis and verification from UC Berkeley. Used internally by Yosys for mapping and sequential optimization.',use:'Gate-level logic optimization and technology mapping.',gh:'https://github.com/berkeley-abc/abc'},{name:'OSS CAD Suite',desc:'Pre-built bundle with Yosys, SymbiYosys, nextpnr, all solvers. One download, everything included.',use:'Instant setup of the complete open-source EDA stack.',gh:'https://github.com/YosysHQ/oss-cad-suite-build'},{name:'Surelog + UHDM',desc:'Full SystemVerilog 2017 parser/elaborator improving SV support in Yosys and Verilator.',use:'Correct elaboration of complex SV before synthesis.',gh:'https://github.com/chipsalliance/Surelog'}]}]},
  pnr:{eye:'Stage 05A — Physical Implementation',title:'Place & Route',desc:'The gate-level netlist is transformed into physical layout. Cells are placed, a clock tree is synthesized, all nets are routed, power rails are strapped, and the result is verified against DRC and LVS rules before generating the final GDSII file for tape-out.',cats:[{title:'Complete RTL-to-GDSII Flows',tools:[{name:'OpenLane / LibreLane',tags:['core','most popular'],desc:'The most popular automated RTL-to-GDSII flow. Integrates Yosys, OpenROAD, Magic, and Netgen into a single CI-ready pipeline.',use:'Complete push-button flow from RTL to tape-out GDSII.',gh:'https://github.com/The-OpenROAD-Project/OpenLane',docs:'https://openlane.readthedocs.io'},{name:'Qflow',desc:'Lighter-weight Verilog-to-layout toolchain: iverilog + Yosys + graywolf + qrouter.',use:'Alternative lightweight physical flow.',gh:'https://github.com/RTimothyEdwards/qflow',web:'http://opencircuitdesign.com/qflow/'}]},{title:'Physical Implementation Tools',tools:[{name:'OpenROAD',desc:'No-human-in-the-loop physical design engine: floorplanning, placement, CTS, routing, and timing.',use:'Automated physical design from netlist to routed layout.',gh:'https://github.com/The-OpenROAD-Project/OpenROAD',web:'https://theopenroadproject.org'},{name:'Magic VLSI',desc:'Open-source layout editor with interactive DRC and LVS for open PDKs.',use:'Layout editing, DRC, and LVS.',gh:'https://github.com/RTimothyEdwards/magic',web:'http://opencircuitdesign.com/magic/'},{name:'KLayout',desc:'Professional GDSII viewer and editor. DRC scripting in Python or Ruby.',use:'GDSII inspection, DRC, and layout editing.',gh:'https://github.com/KLayout/klayout',web:'https://www.klayout.de'},{name:'Netgen (LVS)',desc:'LVS tool comparing routed netlist to schematic — confirms layout matches the intended design.',use:'Layout vs. Schematic sign-off.',gh:'https://github.com/RTimothyEdwards/netgen'}]}]},
  sta:{eye:'Stage 05B — Timing',title:'Static Timing Analysis',desc:'STA verifies setup and hold constraints across all paths for all operating corners, without simulation. It runs in parallel with P&R to drive timing closure — each routing iteration triggers a new STA run to check if timing has been met.',cats:[{title:'STA Tools',tools:[{name:'OpenTimer',desc:'High-performance STA engine in C++17 built on parallel incremental timing. Supports .lib, SPEF, and SDC.',use:'Pre- and post-layout static timing analysis.',gh:'https://github.com/OpenTimer/OpenTimer'},{name:'OpenSTA',desc:'Open-source STA tool integrated into OpenROAD. The standard timing engine in OpenLane. Supports all SDC formats.',use:'Timing analysis within OpenROAD and OpenLane.',gh:'https://github.com/The-OpenROAD-Project/OpenSTA'}]}]},
  pdk:{eye:'Foundation — PDK',title:'Process Design Kits',desc:"PDKs define the manufacturing process: standard cell libraries, DRC rules, SPICE transistor models, metal layer stackups, and design rule documents. Every tool in the flow — from synthesis through DRC sign-off — depends on the PDK to understand the target technology.",cats:[{title:'Open Process Design Kits',tools:[{name:'SkyWater SKY130 PDK',tags:['core','most popular'],desc:"The world's first open-source PDK from Google and SkyWater Technology. 130nm CMOS. The standard for all open tape-outs.",use:'Technology library for all open-source ASIC flows.',gh:'https://github.com/google/skywater-pdk',docs:'https://skywater-pdk.readthedocs.io'},{name:'GF180MCU PDK',desc:'180nm CMOS PDK from GlobalFoundries, open-sourced by Google.',use:'Alternative mature node for open designs.',gh:'https://github.com/google/gf180mcu-pdk'},{name:'IHP SG13G2 PDK',desc:'Open 130nm BiCMOS PDK from IHP — supports digital CMOS and analog/RF.',use:'Mixed-signal and RF design in the open ecosystem.',gh:'https://github.com/IHP-GmbH/IHP-Open-PDK'}]},{title:'PDK Management & Manufacturing',tools:[{name:'Open_PDKs',desc:'Installation and configuration scripts for all open-source PDKs, by Tim Edwards.',use:'Streamlined PDK installation.',gh:'https://github.com/RTimothyEdwards/open_pdks'},{name:'Efabless / chipIgnite',tags:['tape-out'],desc:'The leading open-source chip manufacturing platform. Submit your RTL and receive a real chip on SKY130 at no cost.',use:'Taking your open-source design to actual silicon.',web:'https://efabless.com',gh:'https://github.com/efabless'}]}]},
};

const digital: DomainPage = {
  slug: "digital-ic",
  intent: "primary",
  meta: {
    title: "Digital IC Tools",
    description:
      "Open-source tools for the full digital IC design flow — simulation, formal verification, synthesis, place & route, and timing.",
  },
  hero: {
    eyebrow: "Open Source IC Toolchain",
    title: (
      <>
        Every tool for
        <br />
        <em>Digital IC design</em>,
        <br />
        in one place.
      </>
    ),
    body: "A carefully curated reference for working engineers and students — covering simulation, formal verification, synthesis, place & route, timing, and beyond. All open source.",
    stats: [
      { value: "60+", label: "Tools indexed" },
      { value: "10", label: "Flow stages" },
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
        name: "awesome-opensource-asic-resources",
        desc: "The most comprehensive open-source ASIC list — Matt Venn / Zero to ASIC Course",
        href: "https://github.com/mattvenn/awesome-opensource-asic-resources",
      },
      {
        name: "awesome-open-hardware-verification",
        desc: "Every free and open-source hardware verification tool, organized",
        href: "https://github.com/ben-marshall/awesome-open-hardware-verification",
      },
      {
        name: "eda-collection",
        desc: "Comprehensive EDA tool collection mapped to the full design flow",
        href: "https://github.com/pkuzjx/eda-collection",
      },
    ],
  },
  flow: {
    label: "Interactive flow",
    title: "The IC design flow",
    subtitle:
      "Click any stage to see its tools, what they do, and when to use them.",
    rows: [
      {
        kind: "single",
        stage: {
          num: "01",
          name: "Specification & Architecture",
          desc: "System requirements, micro-architecture decisions, register map definition, interface protocols",
          count: "4 tools",
          panel: "spec",
        },
      },
      {
        kind: "single",
        stage: {
          num: "02",
          name: "RTL Design & HDL Coding",
          desc: "Writing RTL in Verilog, SystemVerilog, VHDL — or generating it via Chisel, Amaranth, or HLS",
          count: "8 tools",
          panel: "hdl",
        },
      },
      {
        kind: "parallel",
        stages: [
          {
            num: "03A",
            name: "Simulation",
            desc: "RTL simulation, Python testbenches, waveform analysis, coverage-driven verification",
            count: "10 tools",
            panel: "sim",
          },
          {
            num: "03B",
            name: "Formal Verification",
            desc: "Property checking, model checking, SAT/SMT solvers, equivalence checking",
            count: "8 tools",
            panel: "formal",
          },
        ],
      },
      {
        kind: "single",
        stage: {
          num: "04",
          name: "Logic Synthesis",
          desc: "RTL → gate-level netlist: technology mapping, logic minimization, elaboration",
          count: "4 tools",
          panel: "synth",
        },
      },
      {
        kind: "parallel",
        stages: [
          {
            num: "05A",
            name: "Place & Route",
            desc: "Floorplan, placement, CTS, routing, DRC/LVS — all the way to GDSII",
            count: "6 tools",
            panel: "pnr",
          },
          {
            num: "05B",
            name: "Static Timing Analysis",
            desc: "Setup/hold checking, timing closure, SPEF parasitics, SDC constraints",
            count: "2 tools",
            panel: "sta",
          },
        ],
      },
      {
        kind: "single",
        stage: {
          num: "◈",
          name: "Process Design Kit (PDK)",
          desc: "Technology libraries, standard cells, DRC rules, SPICE models — the silicon foundation all stages depend on",
          count: "5 tools",
          panel: "pdk",
        },
      },
    ],
  },

  catalog: {
    label: "Complete reference",
    title: "Full tool catalog",
    subtitle: "Every tool indexed, filterable by stage.",
    filters: [
      { id: "all", label: "All" },
      { id: "sim", label: "Simulation" },
      { id: "synth", label: "Synthesis" },
      { id: "formal", label: "Formal" },
      { id: "pnr", label: "P&R" },
      { id: "pdk", label: "PDK" },
      { id: "sta", label: "Timing" },
      { id: "hdl", label: "HDL Tools" },
      { id: "build", label: "Build" },
      { id: "fpga", label: "FPGA" },
      { id: "online", label: "Online" },
    ],
    labels: {
      sim: "Simulation",
      synth: "Synthesis",
      formal: "Formal",
      pnr: "P&R",
      pdk: "PDK",
      sta: "Timing",
      hdl: "HDL",
      build: "Build",
      fpga: "FPGA",
      online: "Online",
    },
    tools: catalogTools,
  },
  panels,
};

export default digital;
