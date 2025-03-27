"use client"

import React, { useState, useRef, useEffect } from 'react';
import Webcam, { WebcamProps } from 'react-webcam';
import { FaCamera, FaTrash, FaRedo } from 'react-icons/fa';
import Image from 'next/image';
import Post from './Post';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface OverlayImage {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  id: number;
  rotation: number;
  scale: number;
}

const Create = () => {
    const webcamRef = useRef<Webcam>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [showPostModal, setShowPostModal] = useState(false);
    const [overlays, setOverlays] = useState<OverlayImage[]>([]);
    const [selectedOverlay, setSelectedOverlay] = useState<number | null>(null);
    const [action, setAction] = useState<'move' | 'rotate' | 'resize' | null>(null);
    const { data: session } = useSession();
    const router = useRouter();
    if (!session) {
        return null;
    }
    
    const videoConstraints: WebcamProps['videoConstraints'] = {
        width: 1280,
        height: 720,
        facingMode: "user"
    };

    const sampleImages = [
        '/img/bonnet.png',
        '/img/cap.png',
        '/img/cat.png',
        '/img/drink.png',
        '/img/glasses.png',
        '/img/hat.png',
        '/img/scarf.png',
        '/img/sun.png',
        '/img/sunglasses.png',
    ];

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!selectedOverlay || !containerRef.current || !action) return;
    
            const container = containerRef.current;
            const currentX = ((e.clientX - container.getBoundingClientRect().left) / container.clientWidth) * 100;
            const currentY = ((e.clientY - container.getBoundingClientRect().top) / container.clientHeight) * 100;
    
            setOverlays(overlays.map(overlay => {
                if (overlay.id !== selectedOverlay) return overlay;
    
                switch (action) {
                    case 'move':
                        return { ...overlay, x: currentX, y: currentY };
                    
                    case 'rotate': {
                        const centerX = overlay.x;
                        const centerY = overlay.y;
                        const angle = Math.atan2(currentY - centerY, currentX - centerX) * (180 / Math.PI);
                        return { ...overlay, rotation: angle };
                    }
                    
                    case 'resize': {
                        const centerX = overlay.x;
                        const centerY = overlay.y;
                        const distance = Math.sqrt(
                            Math.pow(currentX - centerX, 2) + 
                            Math.pow(currentY - centerY, 2)
                        );
                        return { 
                            ...overlay, 
                            scale: Math.max(0.2, Math.min(3, distance / 50)) 
                        };
                    }
                    
                    default:
                        return overlay;
                }
            }));
        };
    
        const handleMouseUp = () => {
            setAction(null);
        };
    
        if (action && containerRef.current) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
    
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [action, selectedOverlay, overlays]);

    const capture = async () => {
        if (!webcamRef.current) return;
    
        const webcamImage = webcamRef.current.getScreenshot();
        if (!webcamImage) {
            console.error("Impossible de capturer l'image de la webcam");
            return;
        }
    
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
    
        const imgWebcam = new window.Image();
        await new Promise<void>((resolve) => {
            imgWebcam.onload = () => resolve();
            imgWebcam.src = webcamImage;
        });
    
        canvas.width = imgWebcam.width;
        canvas.height = imgWebcam.height;
        ctx.drawImage(imgWebcam, 0, 0);
    
        for (const overlay of overlays) {
            const imgOverlay = new window.Image();
            await new Promise<void>((resolve) => {
                imgOverlay.onload = () => resolve();
                imgOverlay.src = overlay.src;
                imgOverlay.crossOrigin = 'anonymous';
            });
    
            ctx.save();
            ctx.translate(
                (overlay.x / 100) * canvas.width,
                (overlay.y / 100) * canvas.height
            );
            ctx.rotate((overlay.rotation * Math.PI) / 180);
            ctx.scale(overlay.scale, overlay.scale);
            ctx.drawImage(
                imgOverlay,
                -overlay.width / 2,
                -overlay.height / 2,
                overlay.width,
                overlay.height
            );
            ctx.restore();
        }
    
        setCapturedImage(canvas.toDataURL('image/jpeg'));
        setShowPostModal(true);
    };

    const addOverlay = (src: string) => {
        const newOverlay: OverlayImage = {
            src,
            x: 50,
            y: 50,
            width: 100,
            height: 100,
            id: Date.now(),
            rotation: 0,
            scale: 1
        };
        setOverlays([...overlays, newOverlay]);
        setSelectedOverlay(newOverlay.id);
    };

    const removeOverlay = (id: number) => {
        setOverlays(overlays.filter(overlay => overlay.id !== id));
        if (selectedOverlay === id) setSelectedOverlay(null);
    };

    const startAction = (actionType: 'move' | 'rotate' | 'resize', e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        
        setAction(actionType);
    };

    const handlePost = async () => {
        if (!capturedImage) return;

        try {
            const blob = await fetch(capturedImage).then(res => res.blob());
        
            const formData = new FormData();
            formData.append('file', blob, `post-${Date.now()}.jpg`);
            formData.append('authorId', session.user.id);

            const response = await fetch('/api/posts', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to post image');
            }

            setShowPostModal(false);
            router.push('/home');
        }
        catch(error) {
            console.error(error);
        }
    }

    return (
        <>
            <div className='bg-white flex-1 rounded-xl shadow-lg flex p-4 gap-6'>
                <div className='flex flex-col flex-1 gap-4 py-12'>
                    <div 
                        ref={containerRef}
                        className='bg-black rounded-lg relative overflow-hidden' 
                        style={{ height: '480px' }}
                    >
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                            className='h-full w-full object-cover'
                        />
                        
                        {overlays.map((overlay) => (
                            <div
                                key={overlay.id}
                                className={`absolute ${selectedOverlay === overlay.id ? 'ring-2 ring-pink-400' : ''} transition-transform duration-100`}
                                style={{
                                    left: `${overlay.x}%`,
                                    top: `${overlay.y}%`,
                                    width: `${overlay.width}px`,
                                    height: `${overlay.height}px`,
                                    transform: `translate(-50%, -50%) rotate(${overlay.rotation}deg) scale(${overlay.scale})`,
                                    transformOrigin: 'center center',
                                    touchAction: 'none'
                                }}
                                onMouseDown={(e) => {
                                    setSelectedOverlay(overlay.id);
                                    startAction('move', e);
                                }}
                            >
                                <Image
                                    src={overlay.src}
                                    alt="Overlay"
                                    width={overlay.width}
                                    height={overlay.height}
                                    className='object-contain'
                                />
                                
                                {selectedOverlay === overlay.id && (
                                    <>
                                        <button
                                            className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 text-xs shadow-md hover:bg-red-600 transition-all'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeOverlay(overlay.id);
                                            }}
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                        
                                        <div
                                            className='absolute -top-10 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-pink-500 rounded-full cursor-grab flex items-center justify-center shadow-md hover:bg-pink-600 transition-all'
                                            onMouseDown={(e) => startAction('rotate', e)}
                                        >
                                            <FaRedo size={14} className='text-white' />
                                        </div>
                                        
                                        <div
                                            className='absolute -bottom-3 -right-3 w-7 h-7 bg-pink-500 rounded-full cursor-nwse-resize flex items-center justify-center shadow-md hover:bg-pink-600 transition-all'
                                            onMouseDown={(e) => startAction('resize', e)}
                                        >
                                            <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                    
                    <div className='flex flex-col items-center'>
                        <button 
                            className='bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg transition-all cursor-pointer'
                            onClick={capture}
                        >
                            <FaCamera size={24} />
                        </button>
                        <span className='text-gray-600 mt-2 text-sm'>Take a picture</span>
                    </div>
                </div>

                <div className='w-64 bg-gray-100 rounded-lg p-3 overflow-y-auto'>
                    <h3 className='text-lg font-semibold mb-3'>Accessories</h3>
                    <div className='grid grid-cols-2 gap-3'>
                        {sampleImages.map((img, index) => (
                            <div 
                                key={index} 
                                className='relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-all border border-gray-200'
                                onClick={() => addOverlay(img)}
                            >
                                <Image
                                    src={img}
                                    alt={`Accessoire ${index + 1}`}
                                    fill
                                    className='object-cover'
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showPostModal && capturedImage && (
                <Post 
                    image={capturedImage} 
                    onClose={() => setShowPostModal(false)}
                    onPost={handlePost}
                />
            )}
        </>
    );
};

export default Create;