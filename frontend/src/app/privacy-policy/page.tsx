import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | NEXUS",
  description: "How Scholar Nexus handles personal data and privacy.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-28 font-main text-neutral-100">
      <h1 className="text-3xl font-bold text-neutral-50 sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-6 text-sm leading-7 text-neutral-200">
        Scholar Nexus respects your privacy. This page is a placeholder for the full
        privacy policy and will be expanded with complete data-handling and
        retention details.
      </p>
      <section className="mt-8 space-y-4 text-sm leading-7 text-neutral-200">
        <p>
          We only use the information necessary to provide the platform, including
          account, profile, and contact-request data submitted through the site.
        </p>
        <p>
          For questions about privacy or data removal, please use the Contact Us
          link in the footer.
        </p>
      </section>
    </main>
  );
}
