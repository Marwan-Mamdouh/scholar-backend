import Image from "next/image";
import { MemoryStick, MessagesSquare, ShieldHalf } from "lucide-react";
import {
  CodeBlock,
  GuideLink,
  GuideList,
  InlineCode,
  NoteBlock,
} from "../GuideBlocks";
import { GuidePage } from "../tools.type";

const environmentSetup: GuidePage = {
  meta: {
    title: "Environment Setup — Docker on Windows",
    description:
      "Step-by-step guide to installing Docker on Windows and launching the pre-configured IIC-OSIC-TOOLS environment.",
  },
  hero: {
    eyebrow: "Installation Guide",
    title: (
      <>
        🐳 Docker Windows
        <br />
        <em>installation</em>.
      </>
    ),
    body: "Follow these steps to successfully install Docker on Windows, set up the necessary tools, and run your container.",
  },
  phases: [
    {
      label: "Phase 1",
      title: "Download & Setup",
      steps: [
        {
          num: "1.",
          title: "Download the OSIC Tools Repository",
          description: (
            <>
              <p>
                Download the repository directly from{" "}
                <GuideLink href="https://github.com/iic-jku/iic-osic-tools">
                  iic-jku/iic-osic-tools
                </GuideLink>
                , or use the following command in Windows PowerShell:
              </p>
              <CodeBlock>
                git clone https://github.com/iic-jku/iic-osic-tools
              </CodeBlock>
            </>
          ),
        },
        {
          num: "2.",
          title: "Download Docker Desktop",
          description: (
            <>
              <p>
                Download Docker Desktop for Windows that corresponds to your
                device&rsquo;s CPU architecture from the official site:{" "}
                <GuideLink href="https://docs.docker.com/desktop/install/windows-install/">
                  Install Docker Desktop on Windows
                </GuideLink>
                .
              </p>
              <NoteBlock title="How to know your CPU’s architecture?">
                <p>Open PowerShell and type the following command:</p>
                <CodeBlock>
                  Get-CimInstance Win32_Processor | Select-Object Name,
                  Architecture
                </CodeBlock>
                <p className="mt-1">
                  Match the <InlineCode>Architecture</InlineCode> value returned
                  to the list below:
                </p>
                <GuideList
                  items={[
                    <>
                      <InlineCode>0</InlineCode> = x86 (32-bit)
                    </>,
                    <>
                      <InlineCode>9</InlineCode> = x64 (AMD/Intel 64-bit)
                    </>,
                    <>
                      <InlineCode>5</InlineCode> = ARM
                    </>,
                    <>
                      <InlineCode>12</InlineCode> = ARM64
                    </>,
                  ]}
                />
              </NoteBlock>
            </>
          ),
        },
      ],
    },
    {
      label: "Phase 2",
      title: "Installation & Configuration",
      steps: [
        {
          num: "3.",
          title: "Install Docker",
          description: (
            <p>
              Run the Docker installer you downloaded and proceed using the
              default settings.
            </p>
          ),
        },
        {
          num: "4.",
          title: "Open Windows PowerShell",
          description: (
            <p>
              Launch a new Windows PowerShell window as an Administrator.
            </p>
          ),
        },
        {
          num: "5.",
          title: "Install Windows Subsystem for Linux (WSL)",
          description: (
            <>
              <p>
                Run the following commands to install WSL and set version 2 as
                your default:
              </p>
              <p className="text-neutral-200">
                (Note: Typo corrected from the original document to ensure the
                command works successfully)
              </p>
              <CodeBlock>
                {"wsl --install\nwsl --set-default-version 2"}
              </CodeBlock>
            </>
          ),
        },
      ],
    },
    {
      label: "Phase 3",
      title: "Launching the Container",
      steps: [
        {
          num: "6.",
          title: "Refresh Docker",
          description: <p>Open or refresh the Docker Desktop application.</p>,
        },
        {
          num: "7.",
          title: "Extract Files",
          description: (
            <p>
              Extract the downloaded <InlineCode>iic-osic-tools</InlineCode>{" "}
              file (if you downloaded it as a ZIP in Step 1).
            </p>
          ),
        },
        {
          num: "8.",
          title: "Run the Batch File",
          description: (
            <p>
              Navigate inside the extracted folder and run the{" "}
              <InlineCode>start_vnc.bat</InlineCode> file.
            </p>
          ),
        },
        {
          num: "9.",
          title: "Locate the Container",
          description: (
            <>
              <p>
                After running the batch file, switch back to the Docker Desktop
                application. Navigate to the{" "}
                <strong className="font-semibold text-neutral-50">
                  Containers
                </strong>{" "}
                section, where you will now see your new container listed.
              </p>
              <Image
                src="/docker-desktop.png"
                alt="Docker Desktop with the iic-osic-tools container listed under Containers"
                width={602}
                height={275}
                className="mt-4 h-auto w-full max-w-2xl rounded-xl border border-neutral-700"
              />
            </>
          ),
        },
        {
          num: "10.",
          title: "Start the Container",
          description: (
            <p>
              Click the{" "}
              <strong className="font-semibold text-neutral-50">
                Play button
              </strong>{" "}
              (▶) next to the container to start it.
            </p>
          ),
        },
        {
          num: "11.",
          title: "Access via Browser",
          description: (
            <p>
              Open any web browser and type{" "}
              <InlineCode highlight>localhost</InlineCode> into the address bar.
            </p>
          ),
        },
        {
          num: "12.",
          title: "Enter Credentials",
          description: (
            <p>
              When prompted, enter the password:{" "}
              <InlineCode highlight>abc123</InlineCode>
            </p>
          ),
        },
        {
          num: "13.",
          title: "Enjoy! 🎉",
          description: <p>You are now ready to use the tools.</p>,
        },
      ],
    },
  ],
  notes: {
    label: "Extra Notes",
    items: [
      {
        icon: <MemoryStick className="h-6 w-6" />,
        title: "System Resources",
        desc: "While Docker is running, it can consume a large portion of RAM and other system resources. This is not caused by Docker itself, but by the VM and the containers’ workloads. WSL 2 dynamically allocates memory and can appear to use most of the RAM. If you run resource-heavy containers alongside other applications, expect some slowness.",
      },
      {
        icon: <ShieldHalf className="h-6 w-6" />,
        title: "Permissions",
        desc: (
          <>
            Make sure you have <strong>admin access</strong> on your laptop to be able to install and use Docker properly.
          </>
        ),
      },
      {
        icon: <MessagesSquare className="h-6 w-6" />,
        title: "Support",
        desc: (
          <>
            You can join the Slack Community for any support here:{" "}
            <GuideLink href="https://open-source-silicon.slack.com/">
              Open Source Silicon Slack
            </GuideLink>
            .
          </>
        ),
      },
    ],
  },
};

export default environmentSetup;
