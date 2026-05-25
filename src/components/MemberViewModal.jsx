import React from "react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Printer, X } from "lucide-react";
import { _get } from "../api";
import PrintPreview from "./PrintPreview";

const joinName = (member) =>
    [member?.first_name, member?.middle_name, member?.last_name]
        .filter(Boolean)
        .join(" ")
        .trim();

const getValue = (value) => value || "";

const FieldLine = ({ label, value, wide = false }) => (
    <div className={`membership-field ${wide ? "membership-field-wide" : ""}`}>
        <span className="membership-label">{label}:</span>
        <span className="membership-line">{getValue(value)}</span>
    </div>
);

const MemberViewModal = ({ onClose, member }) => {
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [pdfUrl, setPdfUrl] = useState("");
    const [showPrintPreview, setShowPrintPreview] = useState(false);
    const [pdfError, setPdfError] = useState("");
    const emergency = member?.emergency_contact || {};
    const fullName = joinName(member);

    useEffect(() => {
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [pdfUrl]);

    const closePrintPreview = () => {
        setShowPrintPreview(false);
        setPdfUrl((previousUrl) => {
            if (previousUrl) {
                URL.revokeObjectURL(previousUrl);
            }
            return "";
        });
    };

    const handlePrintPreview = async () => {
        setIsGeneratingPdf(true);
        setPdfError("");
        try {
            const response = await _get(`/members/${member.id}/form/print`, {
                responseType: "blob",
            });
            const nextUrl = URL.createObjectURL(
                new Blob([response.data], { type: "application/pdf" })
            );

            setPdfUrl((previousUrl) => {
                if (previousUrl) {
                    URL.revokeObjectURL(previousUrl);
                }
                return nextUrl;
            });
            setShowPrintPreview(true);
        } catch (error) {
            console.error("Error generating membership form PDF:", error);
            setPdfError("Unable to generate the membership form PDF.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    if (!member) return null;

    return (
        <AnimatePresence>
            <motion.div
                role="alert"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 flex items-start justify-center bg-black/20 z-50 overflow-y-auto p-4"
            >
                {showPrintPreview && (
                    <PrintPreview
                        onClose={closePrintPreview}
                        data={{
                            title: "Membership Form",
                            subtitle: fullName,
                        }}
                        pdfUrl={pdfUrl}
                    />
                )}
                <style>{`
                    .membership-shell {
                        width: min(100%, 980px);
                    }

                    .membership-page {
                        width: 100%;
                        aspect-ratio: 8.5 / 11;
                        background: #ffffff;
                        color: #0f2742;
                        display: grid;
                        grid-template-columns: 31% 69%;
                        gap: 24px;
                        padding: 28px 30px;
                        font-family: Arial, Helvetica, sans-serif;
                        box-shadow: 0 18px 45px rgba(15, 23, 42, 0.22);
                    }

                    .membership-left {
                        display: flex;
                        flex-direction: column;
                        min-height: 100%;
                    }

                    .membership-logo-box {
                        width: 250px;
                        max-width: 88%;
                        aspect-ratio: 1 / 1;
                        background: linear-gradient(145deg, #f97316, #f6a23a);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 36px auto 34px;
                    }

                    .membership-logo-circle {
                        width: 68%;
                        height: 68%;
                        border-radius: 999px;
                        background: #ffffff;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        overflow: hidden;
                        border: 2px solid #0c8fb3;
                    }

                    .membership-logo-circle img {
                        width: 92%;
                        height: 92%;
                        object-fit: contain;
                    }

                    .membership-org-title {
                        color: #1587b5;
                        font-size: 21px;
                        line-height: 1.25;
                        font-weight: 800;
                        letter-spacing: 0.02em;
                        margin-bottom: 18px;
                    }

                    .membership-left p,
                    .membership-left a {
                        font-size: 13px;
                        line-height: 1.35;
                        color: #0f2742;
                        margin: 0;
                    }

                    .membership-address,
                    .membership-contact-text {
                        font-weight: 800;
                        font-style: italic;
                    }

                    .membership-about {
                        margin-top: 26px;
                        font-weight: 700;
                        font-style: italic;
                    }

                    .membership-sidebar-heading {
                        color: #0f2742;
                        font-size: 19px;
                        font-weight: 900;
                        margin: 24px 0 14px;
                        letter-spacing: 0.02em;
                    }

                    .membership-contact {
                        margin-top: auto;
                        padding-top: 22px;
                    }

                    .membership-contact .membership-sidebar-heading {
                        color: #34a8d6;
                        margin-bottom: 16px;
                    }

                    .membership-contact-label {
                        color: #0f2742;
                        font-weight: 900;
                        margin-top: 17px !important;
                    }

                    .membership-contact a {
                        color: #1587b5;
                        text-decoration: underline;
                        word-break: break-word;
                    }

                    .membership-main {
                        display: flex;
                        flex-direction: column;
                        gap: 16px;
                    }

                    .membership-section {
                        border: 1.8px solid #0f2742;
                        padding: 14px 14px 16px;
                    }

                    .membership-personal {
                        min-height: 390px;
                    }

                    .membership-title-row {
                        display: flex;
                        align-items: flex-start;
                        justify-content: space-between;
                        gap: 16px;
                        margin-bottom: 10px;
                    }

                    .membership-title {
                        color: #f9b46b;
                        font-size: 30px;
                        font-weight: 400;
                        letter-spacing: 0.04em;
                        margin: 14px 0 58px 8px;
                    }

                    .membership-picture {
                        width: 118px;
                        height: 118px;
                        border: 1.6px solid #0f2742;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        text-align: center;
                        font-size: 12px;
                        font-weight: 900;
                        line-height: 1.2;
                        margin-right: 8px;
                    }

                    .membership-section-heading {
                        color: #f9b46b;
                        font-size: 17px;
                        font-weight: 400;
                        letter-spacing: 0.03em;
                        border-bottom: 1px solid #4a9fc3;
                        padding-bottom: 4px;
                        margin-bottom: 12px;
                    }

                    .membership-field {
                        display: grid;
                        grid-template-columns: auto 1fr;
                        align-items: end;
                        gap: 7px;
                        min-height: 33px;
                        margin-bottom: 3px;
                    }

                    .membership-field-wide {
                        min-height: 48px;
                    }

                    .membership-label {
                        color: #0f2742;
                        font-size: 13px;
                        font-weight: 900;
                        white-space: nowrap;
                    }

                    .membership-line {
                        display: block;
                        min-height: 20px;
                        border-bottom: 1.6px solid #0f2742;
                        color: #0f2742;
                        font-size: 12px;
                        font-weight: 600;
                        padding: 0 5px 2px;
                    }

                    .membership-emergency {
                        min-height: 270px;
                    }

                    .membership-signature {
                        min-height: 100px;
                        display: flex;
                        align-items: end;
                        justify-content: center;
                        padding-bottom: 18px;
                    }

                    .membership-signature-line {
                        width: 82%;
                        border-top: 1.6px solid #0f2742;
                        text-align: center;
                        font-size: 13px;
                        font-weight: 900;
                        padding-top: 5px;
                    }

                    .membership-privacy {
                        min-height: 270px;
                    }

                    .membership-privacy-title {
                        font-size: 15px;
                        font-weight: 900;
                        margin: 0 0 28px;
                    }

                    .membership-privacy p {
                        font-size: 13px;
                        line-height: 1.35;
                        font-weight: 800;
                        font-style: italic;
                        margin: 0 0 18px;
                    }

                    .membership-actions {
                        display: flex;
                        justify-content: flex-end;
                        gap: 10px;
                        background: #ffffff;
                        padding: 12px;
                        border-radius: 0 0 8px 8px;
                    }

                    @media (max-width: 900px) {
                        .membership-page {
                            width: 900px;
                        }

                        .membership-shell {
                            overflow-x: auto;
                        }
                    }

                    @page {
                        size: letter portrait;
                        margin: 0.25in;
                    }

                    @media print {
                        body * {
                            visibility: hidden !important;
                        }

                        .membership-print-area,
                        .membership-print-area * {
                            visibility: visible !important;
                        }

                        .membership-actions,
                        .membership-actions * {
                            display: none !important;
                        }

                        .membership-print-area {
                            position: fixed !important;
                            inset: 0 !important;
                            width: 100% !important;
                            margin: 0 !important;
                            padding: 0 !important;
                        }

                        .membership-page {
                            width: 8in !important;
                            min-height: 10.5in !important;
                            aspect-ratio: auto !important;
                            box-shadow: none !important;
                            padding: 0.22in 0.25in !important;
                            gap: 0.22in !important;
                            print-color-adjust: exact;
                            -webkit-print-color-adjust: exact;
                        }
                    }
                `}</style>

                <div className="membership-shell membership-print-area">
                    <div className="membership-page">
                        <aside className="membership-left">
                            <div className="membership-logo-box">
                                <div className="membership-logo-circle">
                                    <img src="/logo.png" alt="Kalinga ng Kababaihan" />
                                </div>
                            </div>

                            <div className="membership-org-title">
                                KALINGA NG KABABAIHAN<br />
                                WOMEN'S LEAGUE LAS PINAS
                            </div>

                            <p className="membership-address">
                                84 LOT6-6 FANTACY ROAD 3 TERESA PARK<br />
                                SUBD. PILAR LAS PINAS CITY<br />
                                SEC REG. NO.: 2024100171937-10
                            </p>

                            <p className="membership-about">
                                A self-sustaining non-governmental organization that aims to promote a sense of
                                community and cooperation among like-minded and self-sufficiency-seeking
                                individuals to contribute to the betterment of the society.
                            </p>

                            <div>
                                <div className="membership-sidebar-heading">VISION</div>
                                <p className="membership-about" style={{ marginTop: 0 }}>
                                    Empowered and united women through volunteerism towards community resiliency and development.
                                </p>
                            </div>

                            <div>
                                <div className="membership-sidebar-heading">MISSION</div>
                                <p className="membership-about" style={{ marginTop: 0 }}>
                                    To promote and strengthen the physical and social well-being of children and senior
                                    members of the community, through nutrition programs, greening and planting programs,
                                    responding to emergencies and calamities.
                                </p>
                            </div>

                            <div className="membership-contact">
                                <div className="membership-sidebar-heading">CONTACT</div>
                                <p className="membership-contact-text">
                                    LL#: 0283742811<br />
                                    CP#: 09209859508
                                </p>
                                <p className="membership-contact-label">FB PAGE:</p>
                                <a href="https://www.facebook.com/kalingangkababaihanwllpc" target="_blank" rel="noreferrer">
                                    https://www.facebook.com/kalingangkababaihanwllpc
                                </a>
                                <p className="membership-contact-label">EMAIL:</p>
                                <p className="membership-contact-text">kalingangkababaihan.wllpc@gmail.com</p>
                            </div>
                        </aside>

                        <main className="membership-main">
                            <section className="membership-section membership-personal">
                                <div className="membership-title-row">
                                    <h2 className="membership-title">MEMBERSHIP FORM</h2>
                                    <div className="membership-picture">1x1<br />PICTURE</div>
                                </div>
                                <div className="membership-section-heading">PERSONAL INFORMATION</div>
                                <FieldLine label="FULLNAME" value={fullName} />
                                <FieldLine label="NICKNAME" value={member.nick_name} />
                                <FieldLine label="COMPLETE ADDRESS" value={member.address} wide />
                                <FieldLine label="BIRTHDATE" value={member.dob} />
                                <FieldLine label="CIVIL STATUS" value={member.civil_status} />
                                <FieldLine label="CONTACT NUMBER" value={member.contact_number} />
                                <FieldLine label="FACEBOOK/MESSENGER ACCOUNT" value={member.fb_messenger_account} />
                            </section>

                            <section className="membership-section membership-emergency">
                                <div className="membership-section-heading">EMERGENCY CONTACT INFORMATION</div>
                                <FieldLine label="CONTACT PERSON" value={emergency.contact_person} />
                                <FieldLine label="COMPLETE ADDRESS" value={emergency.address} wide />
                                <FieldLine label="CONTACT NUMBER" value={emergency.contact_number} />
                                <FieldLine label="FB/MESSENGER ACCOUNT" value={emergency.fb_messenger_account} />
                                <FieldLine label="RELATION TO THE APPLICANT" value={emergency.relationship} />
                            </section>

                            <section className="membership-section membership-signature">
                                <div className="membership-signature-line">COMPLETE NAME AND SIGNATURE</div>
                            </section>

                            <section className="membership-section membership-privacy">
                                <h3 className="membership-privacy-title">DATA PRIVACY</h3>
                                <p>
                                    In compliance with the R.A. 10173 or "DATA PRIVACY ACT of 2012", all the information
                                    provided on this form shall be collected for specified and legitimate purposes only,
                                    processed fairly and lawfully, adequate, and not excessive in relation to the purposes
                                    for which they are collected and processed and treated with confidentiality.
                                </p>
                                <p>
                                    By signing this form, I agree on the processing of my personal information and payment
                                    of corresponding fees. I am also certifying that this membership form has been
                                    accomplished by me and is true, correct and complete. I also authorize the KALINGA NG
                                    KABABAIHAN WOMEN'S LEAGUE LAS PINAS or its representative to validate the contents
                                    stated herein.
                                </p>
                            </section>
                        </main>
                    </div>

                    <div className="membership-actions">
                        {pdfError && (
                            <p className="mr-auto self-center text-[11px] text-red-500">{pdfError}</p>
                        )}
                        <button
                            type="button"
                            onClick={handlePrintPreview}
                            disabled={isGeneratingPdf}
                            className="inline-flex items-center gap-2 rounded bg-gray-100 hover:bg-gray-200 px-4 py-2 text-xs text-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <Printer size={14} />
                            {isGeneratingPdf ? "Generating..." : "Print"}
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-xs shadow-md"
                            onClick={onClose}
                        >
                            <X size={14} />
                            Close
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default MemberViewModal;
