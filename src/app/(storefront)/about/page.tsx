"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Heart,
  Eye,
  Target,
  Sparkles,
  ArrowRight,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_NAME } from "@/lib/constants";

const values = [
  {
    icon: Heart,
    title: "Our Mission",
    description:
      "To bring joy to every snack moment by crafting delicious, high-quality treats made with the finest ingredients. We believe everyone deserves access to freshly made snacks that taste like they were prepared just for them.",
    color: "text-rose-500",
    bg: "bg-rose-50 dark:bg-rose-950/30",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description:
      "To become the most loved and trusted online snack destination, where quality meets convenience. We envision a world where the best snacks are just a click away, delivered fresh to your doorstep.",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: Target,
    title: "Our Values",
    description:
      "Quality ingredients, sustainable practices, community support, and customer delight drive everything we do. We source locally when possible and never compromise on taste or freshness.",
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
];

const teamMembers = [
  {
    name: "Zara Okonkwo",
    role: "Founder & CEO",
    bio: "Passionate foodie who started Zoza Gateway Snacks from her home kitchen. Zara brings 10+ years of culinary expertise.",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200",
  },
  {
    name: "David Kim",
    role: "Head of Operations",
    bio: "Supply chain expert ensuring every order arrives fresh and on time. David optimizes our delivery network daily.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
  },
  {
    name: "Maria Santos",
    role: "Lead Pastry Chef",
    bio: "Award-winning pastry chef crafting our signature cookies, pastries, and sweet treats with creative flair.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-background to-orange-50 dark:from-brand-950/30 dark:via-background dark:to-orange-950/20 py-20 md:py-28">
        <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-brand-300/20 blur-3xl dark:bg-brand-500/10" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl dark:bg-orange-500/10" />

        <div className="container relative mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-brand-500" />
              <span>Our Story</span>
            </div>
            <h1 className="text-4xl font-bold font-heading md:text-5xl lg:text-6xl mb-6">
              About{" "}
              <span className="bg-gradient-to-r from-brand-500 to-orange-400 bg-clip-text text-transparent">
                {SITE_NAME}
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Born from a love of good food and a dream to make freshly made snacks
              accessible to everyone, anywhere.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold font-heading md:text-3xl mb-6">
                From Kitchen to Doorstep
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  {SITE_NAME} started in 2022 as a small home kitchen operation, born
                  from founder Zara Okonkwo&apos;s passion for creating delicious,
                  handcrafted snacks. What began as weekend batches of cookies and chips
                  for friends and family quickly grew into something much bigger.
                </p>
                <p>
                  Today, we serve thousands of happy customers every month, offering a
                  curated selection of over 100 freshly made snacks, from classic
                  kettle chips and artisan cookies to healthy bites and refreshing
                  beverages. Every product is made with premium, carefully sourced
                  ingredients and prepared in small batches for maximum freshness.
                </p>
                <p>
                  We believe that snacking should be an experience - not just fuel.
                  That is why we put the same care and attention into every bag of chips,
                  every cookie, and every trail mix pack that leaves our kitchen.
                  Your satisfaction is our recipe for success.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
              <Image
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600"
                alt="Zoza Gateway Snacks kitchen"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Mission, Vision, Values */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="py-16 bg-muted/30"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold font-heading md:text-3xl">
              What Drives Us
            </h2>
            <p className="mt-2 text-muted-foreground max-w-lg mx-auto">
              The principles that guide every decision and every snack we create
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {values.map((item) => (
              <motion.div key={item.title} variants={staggerItem}>
                <Card className="h-full border transition-shadow hover:shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${item.bg}`}
                    >
                      <item.icon className={`h-8 w-8 ${item.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-brand-500" />
              <span className="text-sm font-semibold text-brand-500 uppercase tracking-wide">
                Our Team
              </span>
            </div>
            <h2 className="text-2xl font-bold font-heading md:text-3xl">
              Meet the People Behind the Snacks
            </h2>
            <p className="mt-2 text-muted-foreground max-w-lg mx-auto">
              A passionate team dedicated to bringing you the best snacking experience
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {teamMembers.map((member) => (
              <motion.div key={member.name} variants={staggerItem}>
                <Card className="overflow-hidden text-center transition-shadow hover:shadow-lg">
                  <div className="relative h-48 w-full bg-muted">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-sm text-brand-500 font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="py-16 bg-gradient-to-r from-brand-500 to-orange-400 dark:from-brand-700 dark:to-orange-600"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white md:text-3xl font-heading mb-4">
            Ready to Try Our Snacks?
          </h2>
          <p className="text-white/80 max-w-md mx-auto mb-8">
            Browse our full menu and discover your new favorite treats.
            Freshly made, quickly delivered.
          </p>
          <Link href="/menu">
            <Button
              size="lg"
              className="bg-white text-brand-500 hover:bg-white/90 font-semibold px-8 h-12 text-base"
            >
              Browse Our Menu
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </motion.section>
    </div>
  );
}