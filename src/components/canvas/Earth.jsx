"use client";
import React, { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { useMotionValue, useSpring } from "framer-motion";
import Model from "../Model";
import CanvasLoader from "../Loader";

const Earth = () => {
    const mouse = {
        x: useMotionValue(0),
        y: useMotionValue(0),
    };

    const smoothMouse = {
        x: useSpring(mouse.x, { stiffness: 75, damping: 100, mass: 3 }),
        y: useSpring(mouse.y, { stiffness: 75, damping: 100, mass: 3 }),
    };

    const manageMouse = (e) => {
        const { innerWidth, innerHeight } = window;
        const { clientX, clientY } = e;
        const x = clientX / innerWidth;
        const y = clientY / innerHeight;
        mouse.x.set(x);
        mouse.y.set(y);
    };

    useEffect(() => {
        window.addEventListener("mousemove", manageMouse);
        return () => window.removeEventListener("mousemove", manageMouse);
    }, []);

    return (
        <div className="h-[800px] w-[800px] absolute inset-y-0 right-0">
            <Canvas orthographic camera={{ position: [0, 0, 200], zoom: 4 }}>
                <Suspense fallback={<CanvasLoader />}>
                    <Model mouse={smoothMouse} />
                    <Environment preset="dawn" />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Earth;
