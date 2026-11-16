import Image from "next/image";

// Rendered at the PNG's intrinsic size (151×50)
export default function Logo() {
  return <Image src="/logo.png" alt="NEXUS" width={151} height={50} priority />;
}
