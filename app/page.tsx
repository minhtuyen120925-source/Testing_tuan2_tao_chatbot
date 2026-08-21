import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/landing/hero";
import { QuoteForm } from "@/components/landing/quote-form";
import { Highlights } from "@/components/landing/highlights";
import { ChatWidget } from "@/components/landing/chat-widget";

export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <QuoteForm />
        <Highlights />
      </main>
      <SiteFooter />
      <ChatWidget />
    </>
  );
}
