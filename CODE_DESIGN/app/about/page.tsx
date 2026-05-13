import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="py-24 bg-muted/30">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold">About DE GYM Platinum</h1>
              <p className="text-xl text-muted-foreground">
                Founded in the heart of Kuta, Bali, DE GYM Platinum is more than just a fitness center. 
                It's a community dedicated to excellence, health, and personal transformation.
              </p>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop" 
                  alt="Gym Interior" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-8">
                <h2 className="text-3xl font-bold">Our Mission</h2>
                <p className="text-lg text-muted-foreground">
                  To provide a world-class fitness environment that inspires and empowers individuals 
                  to achieve their peak physical and mental potential through expert guidance, 
                  state-of-the-art facilities, and a supportive community.
                </p>
                <div className="space-y-4">
                  {[
                    "Premium state-of-the-art equipment",
                    "Expert certified fitness professionals",
                    "Diverse range of group fitness classes",
                    "Luxury amenities and recovery zones",
                    "Inclusive and motivating atmosphere"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}