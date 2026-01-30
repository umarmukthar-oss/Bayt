import Link from 'next/link'
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-maroon text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl font-bold font-serif">Bayt Shawarma&apos;s</span>
                            <span className="px-2 py-0.5 text-xs font-bold bg-green-600 rounded-full">Halal</span>
                        </div>
                        <p className="text-white/70 mb-4">
                            Authentic Middle Eastern shawarmas made with love and served fresh daily.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/#menu" className="text-white/70 hover:text-white transition-colors">
                                    Menu
                                </Link>
                            </li>
                            <li>
                                <Link href="/track-order" className="text-white/70 hover:text-white transition-colors">
                                    Track Order
                                </Link>
                            </li>
                            <li>
                                <Link href="/checkout" className="text-white/70 hover:text-white transition-colors">
                                    Cart
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-white/70">
                                <Phone size={18} />
                                <a href="tel:+919080480773" className="hover:text-white transition-colors">
                                    +91 9080480773
                                </a>
                            </li>
                            <li className="flex items-center gap-3 text-white/70">
                                <Mail size={18} />
                                <a href="mailto:hello@baytshawarmas.com" className="hover:text-white transition-colors">
                                    hello@baytshawarmas.com
                                </a>
                            </li>
                            <li className="flex items-start gap-3 text-white/70">
                                <MapPin size={18} className="flex-shrink-0 mt-1" />
                                <span>Your Local Area, City</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
                    <p>© 2026 Bayt Shawarma&apos;s. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
