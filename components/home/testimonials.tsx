'use client';

import { motion } from "framer-motion";
import { Star, Quote, CheckCircle2 } from "lucide-react";
import Image from "next/image";

const testimonials = [
    {
        id: 1,
        name: "Aman Singh",
        role: "Regular Customer",
        content: "The variety of authentic spices and rice is unmatched. I finally found the exact brand of Basmati I used back home. Delivery was fast and everything was perfectly packed.",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?u=aman",
    },
    {
        id: 2,
        name: "Elena Rodriguez",
        role: "Home Chef",
        content: "As someone who loves cooking international dishes, this site is a goldmine. The tropical fruits are actually fresh when they arrive. Highly recommended for foodies in Sweden!",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?u=elena",
    },
    {
        id: 3,
        name: "Malik Ibrahim",
        role: "Local Business Owner",
        content: "Brothers Cash & Carry has been my go-to for bulk spices for months. Excellent service, transparent pricing, and they really care about their customers.",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?u=malik",
    },
];

const stats = [
    { label: "Happy Customers", value: "10k+" },
    { label: "Products", value: "2,500+" },
    { label: "Delivery Cities", value: "15+" },
    { label: "Store Rating", value: "4.9/5" },
];

export function Testimonials() {
    return (
        <section className="py-20 bg-muted/30 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -ml-48 -mb-48" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="overline text-primary mb-4 block underline decoration-2 underline-offset-8">What Our Customers Say</span>
                        <h2 className="h1 text-foreground mb-6">Trusted by thousands of food lovers across Sweden</h2>
                        <p className="body text-muted-foreground">Join our community of satisfied customers who enjoy authentic tastes from around the world delivered straight to their doors.</p>
                    </motion.div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 text-center">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-white shadow-soft"
                        >
                            <div className="h2 text-primary mb-1">{stat.value}</div>
                            <div className="label-text text-muted-foreground">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.6 }}
                            className="relative p-8 rounded-3xl bg-white border border-neutral-100 shadow-xl group hover:shadow-2xl transition-all hover:-translate-y-2"
                        >
                            <div className="absolute top-8 right-8 text-primary/10">
                                <Quote size={48} />
                            </div>

                            <div className="flex gap-1 mb-6">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>

                            <p className="text-neutral-700 italic mb-8 relative z-10">"{testimonial.content}"</p>

                            <div className="flex items-center gap-4 border-t border-neutral-50 pt-6">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                                    <Image
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="font-bold text-primary-950 flex items-center gap-1">
                                        {testimonial.name}
                                        <CheckCircle2 size={14} className="text-blue-500" />
                                    </div>
                                    <div className="text-xs text-neutral-500">{testimonial.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Trust Signals */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700"
                >
                    {/* Use placeholders for trust logos - could be standard trust symbols */}
                    <div className="text-xl font-black italic tracking-tighter">TRUSTPILOT</div>
                    <div className="text-xl font-black italic tracking-tighter">GOOGLE REVIEWS</div>
                    <div className="text-xl font-black italic tracking-tighter">SAFE SHOPPING</div>
                    <div className="text-xl font-black italic tracking-tighter">SWEDISH QUALITY</div>
                </motion.div>
            </div>
        </section>
    );
}
