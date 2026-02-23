"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { contactSchema, type ContactInput } from "@/lib/validators";
import { SITE_NAME } from "@/lib/constants";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    details: "+2349039412203",
    subtext: "Mon-Fri, 9am-6pm WAT",
  },
  {
    icon: Mail,
    title: "Email",
    details: "zozagatewaysnacks@gmail.com",
    subtext: "We reply within 24 hours",
  },
  {
    icon: MapPin,
    title: "Address",
    details: "No. 85 Eika Adagu New Layout",
    subtext: "Okehi, Kogi State",
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: "Mon - Fri: 9AM - 6PM",
    subtext: "Sat: 10AM - 4PM, Sun: Closed",
  },
];

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactInput) => {
    try {
      await addDoc(collection(db, "contactMessages"), {
        ...data,
        createdAt: serverTimestamp(),
        read: false,
      });
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-background to-orange-50 dark:from-brand-950/30 dark:via-background dark:to-orange-950/20 py-16 md:py-20">
        <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-brand-300/20 blur-3xl dark:bg-brand-500/10" />
        <div className="container relative mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold font-heading md:text-5xl mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Have a question, feedback, or just want to say hi? We would love to hear
              from you!
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="lg:col-span-3"
          >
            <Card>
              <CardContent className="p-6 md:p-8">
                <h2 className="text-xl font-bold font-heading mb-6">
                  Send Us a Message
                </h2>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center py-12 text-center"
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/30">
                      <CheckCircle2 className="h-8 w-8 text-green-500" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-muted-foreground max-w-sm">
                      Thank you for reaching out. We will get back to you within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          {...register("name")}
                        />
                        {errors.name && (
                          <p className="text-xs text-destructive">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          {...register("email")}
                        />
                        {errors.email && (
                          <p className="text-xs text-destructive">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="How can we help?"
                        {...register("subject")}
                      />
                      {errors.subject && (
                        <p className="text-xs text-destructive">
                          {errors.subject.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your inquiry..."
                        rows={5}
                        {...register("message")}
                      />
                      {errors.message && (
                        <p className="text-xs text-destructive">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 h-11 px-8"
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info Sidebar */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Contact Cards */}
            <div className="space-y-4">
              {contactInfo.map((info) => (
                <Card key={info.title} className="transition-shadow hover:shadow-md">
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950/30">
                      <info.icon className="h-5 w-5 text-brand-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">{info.title}</h3>
                      <p className="text-sm text-foreground">{info.details}</p>
                      <p className="text-xs text-muted-foreground">{info.subtext}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Map Placeholder */}
            <Card className="overflow-hidden">
              <div className="relative h-48 bg-muted flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Interactive Map
                  </p>
                  <p className="text-xs text-muted-foreground">
                    123 Snack Street, Food City
                  </p>
                </div>
              </div>
            </Card>

            {/* Social Media */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold mb-3">Follow Us</h3>
                <div className="flex items-center gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-brand-500 hover:text-white"
                      aria-label={social.label}
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}