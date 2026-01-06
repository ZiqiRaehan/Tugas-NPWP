"use client";

import React, { useState, useRef } from "react";
import "./FormVerifikasiWajah.css";

// Simple icons
const CameraIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
        <circle cx="12" cy="13" r="4"></circle>
    </svg>
);

const UploadIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
);

export default function FormVerifikasiWajah({ onNext }: { onNext?: (data: any) => void }) {
    const [mode, setMode] = useState<"initial" | "camera" | "preview">("initial");
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "failed">("idle");
    const [statusMessage, setStatusMessage] = useState("");

    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Camera handling
    const startCamera = async () => {
        setMode("camera");
        setVerificationStatus("idle");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Gagal mengakses kamera. Pastikan izin kamera diberikan.");
            setMode("initial");
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    const takePhoto = () => {
        if (videoRef.current) {
            const canvas = document.createElement("canvas");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0);
                const dataUrl = canvas.toDataURL("image/jpeg");
                setImageSrc(dataUrl);
                setMode("preview");
                stopCamera();
                // Auto verify after capture
                verifyImage(dataUrl);
            }
        }
    };

    // File Upload handling
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setVerificationStatus("idle");
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target?.result as string;
                setImageSrc(dataUrl);
                setMode("preview");
                verifyImage(dataUrl, file);
            };
            reader.readAsDataURL(file);
        }
    };

    // API Verification
    const verifyImage = async (dataUrl: string, fileObject?: File) => {
        setIsVerifying(true);
        setStatusMessage("Sedang memverifikasi wajah...");

        try {
            const formData = new FormData();

            // Convert DataURL to Blob if captured from camera
            if (!fileObject) {
                const res = await fetch(dataUrl);
                const blob = await res.blob();
                formData.append("image", blob, "camera-capture.jpg");
            } else {
                formData.append("image", fileObject);
            }

            const token = sessionStorage.getItem("token");
            if (!token) throw new Error("Anda belum login.");

            const response = await fetch("https://api2.mizstudio.my.id/api/face-verification/verify", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            const json = await response.json();

            if (response.ok) {
                setVerificationStatus("success");
                setStatusMessage("Verifikasi Berhasil! Identitas terkonfirmasi.");
            } else {
                setVerificationStatus("failed");
                setStatusMessage(json.message || "Verifikasi gagal. Wajah tidak cocok atau tidak terdeteksi.");
            }

        } catch (error) {
            console.error("Verification error:", error);
            setVerificationStatus("failed");
            setStatusMessage("Terjadi kesalahan sistem saat verifikasi.");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleNext = () => {
        if (onNext) onNext({ verified: true });
    };

    const retry = () => {
        setImageSrc(null);
        setMode("initial");
        setVerificationStatus("idle");
        setStatusMessage("");
    };

    return (
        <div className="verifikasi-container">
            <h2 className="verifikasi-title">Silakan ambil foto atau unggah dari komputer Anda</h2>

            {mode === "initial" && (
                <div className="options-container">
                    <button className="option-btn" onClick={startCamera}>
                        <CameraIcon />
                        Take a photo
                    </button>
                    <div className="divider">Atau</div>
                    <button className="option-btn" onClick={() => fileInputRef.current?.click()}>
                        <UploadIcon />
                        Upload photo
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        accept="image/*"
                        onChange={handleFileUpload}
                    />
                </div>
            )}

            {mode === "camera" && (
                <div className="camera-preview-container">
                    <video ref={videoRef} autoPlay playsInline className="video-preview"></video>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
                        <button className="option-btn" onClick={() => { stopCamera(); setMode("initial"); }}>Batal</button>
                        <button className="capture-btn" onClick={takePhoto}>Ambil Foto</button>
                    </div>
                </div>
            )}

            {mode === "preview" && imageSrc && (
                <div className="camera-preview-container">
                    <img src={imageSrc} alt="Preview" className="img-preview" />

                    {isVerifying ? (
                        <div className="verification-status">
                            <p>⏳ Sedang memproses...</p>
                        </div>
                    ) : (
                        <div className={`verification-status ${verificationStatus === 'success' ? 'status-success' : 'status-error'}`}>
                            <p>{statusMessage}</p>
                        </div>
                    )}

                    <div style={{ marginTop: '15px' }}>
                        {verificationStatus !== "success" && !isVerifying && (
                            <button className="option-btn" onClick={retry} style={{ width: '100%' }}>Coba Lagi</button>
                        )}
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    className="btn-next-action"
                    onClick={handleNext}
                    disabled={verificationStatus !== "success" || isVerifying}
                >
                    Lanjut
                </button>
            </div>
        </div>
    );
}
