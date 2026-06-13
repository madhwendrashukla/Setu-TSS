import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Use | Setu - TheStartupSchool',
    description: 'Terms of Use for Setu - TheStartupSchool (RAMSETU ALTERNATE EDUCATION SOLUTIONS PVT LTD)',
};

export default function TermsOfUsePage() {
    return (
        <div className="pt-32 pb-20 min-h-screen bg-bg-main relative overflow-hidden">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent-violet/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <header className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
                        Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-violet to-accent-blue">Use.</span>
                    </h1>
                    <p className="text-gray-400 font-medium">Effective Date: January 23, 2026</p>
                </header>

                <div className="glass-card rounded-[2rem] p-8 md:p-12 space-y-10 text-gray-300 border border-white/10 bg-white/5 backdrop-blur-xl leading-relaxed font-light">
                    <section>
                        <p>
                            Welcome to RAMSETU ALTERNATE EDUCATION SOLUTIONS PVT LTD (the "Setu - TheStartupSchool"). These Terms of Use ("Terms") govern your use of our website <a href="https://www.thestartupschool.in" className="text-accent-violet hover:underline">https://www.thestartupschool.in</a> and <a href="https://thestartupschool.org.in" className="text-accent-violet hover:underline">setu-tss.org.in</a> (hereinafter referred as the "Site") and the services provided by Setu - TheStartupSchool ("we," "our," or "us"). By accessing or using the Site, you agree to comply with and be bound by these Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                        <p>By accessing or using the Site, you agree to these Terms and our Privacy Policy. If you do not agree, please do not use the Site.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">2. Use of the Site</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-white font-semibold mb-2">Eligibility:</h3>
                                <p>You must be at least 13 years old to use the Site. By using the Site, you represent and warrant that you have the right, authority, and capacity to enter into these Terms.</p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Account Registration:</h3>
                                <p>You may be required to create an account to access certain features of the Site. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password and for any activities or actions under your account.</p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">User Conduct:</h3>
                                <p>You agree not to use the Site for any unlawful purpose or in any way that could damage, disable, overburden, or impair the Site. You agree not to use any automated system, including without limitation, "robots," "spiders," or "offline readers," to access the Site.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">3. Services</h2>
                        <p>Setu - TheStartupSchool provides educational services, business consultancy services, training services, mentoring services in online and offline training mode. The terms and conditions specific to these services will be provided separately upon request and must be agreed to before using those services.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">4. Intellectual Property</h2>
                        <p>The Site and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by Setu - TheStartupSchool, its licensors, or other providers of such material.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">5. Limitation of Liability</h2>
                        <p>
                            To the fullest extent permitted by law, Setu - TheStartupSchool shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (a) your use or inability to use the Site; (b) any unauthorized access to or use of our servers and/or any personal information stored therein; (c) any interruption or cessation of transmission to or from the Site; (d) any bugs, viruses, trojan horses, or the like that may be transmitted to or through our Site by any third party; (e) any errors or omissions in any content or for any loss or damage incurred as a result of the use of any content posted, emailed, transmitted, or otherwise made available through the Site; and/or (f) the defamatory, offensive, or illegal conduct of any third party.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">6. Governing Law</h2>
                        <p>
                            These Terms are governed by and construed in accordance with the laws of India without regard to its conflict of law principles. You agree to submit to the exclusive jurisdiction of the courts located in Mumbai, India to resolve any dispute arising out of these Terms or the Site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">7. Changes to Terms</h2>
                        <p>
                            Setu - TheStartupSchool reserves the right to revise these Terms at any time. You are advised to review these Terms periodically for any changes. Your continued use of the Site following the posting of the revised Terms means that you accept and agree to the changes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">8. Contact Us</h2>
                        <p className="mb-2">If you have any questions about these Terms, please contact us at:</p>
                        <p className="font-medium text-white">
                            Setu - TheStartupSchool (RAMSETU ALTERNATE EDUCATION SOLUTIONS PVT LTD.) <br />
                            <a href="mailto:info@thestartupschool.in" className="text-accent-violet hover:underline">info@thestartupschool.in</a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
