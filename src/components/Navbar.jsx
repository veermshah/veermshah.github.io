import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { styles } from "../styles";
import { navLinks } from "../constants";
import { logo, menu, close } from "../assets";
import { motion, useScroll } from "framer-motion";
import music from "../assets/music.mp3";
import { Howl, Howler } from "howler";

const Navbar = () => {
    const [active, setActive] = useState("");
    const [toggle, setToggle] = useState(false);
    const { scrollYProgress } = useScroll();
    const [musicPlaying, setMusicPlaying] = useState(false);
    const bgMusic = new Audio(music);
    var sound = new Howl({
        src: [music],
    });

    return (
        <>
            <nav
                className={`${styles.paddingX} w-full flex items-center py-5 fixed top-0 z-20 bg-primary`}
            >
                <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
                    <Link
                        to="/"
                        className="flex items-center gap-2"
                        onClick={() => {
                            setActive("");
                            window.scrollTo(0, 0);
                        }}
                    >
                        <p className="text-white cursor-pointer font-bold text-[18px] flex">
                            Veer Shah &nbsp;
                            <span className="sm:block hidden">
                                | Software Engineer | ML
                            </span>
                        </p>
                    </Link>
                    <button
                        className="text-secondary hover:text-white cursor-pointer font-bold text-[16px]"
                        onClick={() => {
                            if (musicPlaying === false) {
                                sound.play();
                                setMusicPlaying(true);
                            } else {
                                Howler.stop();
                                setMusicPlaying(false);
                            }
                        }}
                    >
                        {musicPlaying ? "Music On" : "Music Off"}
                    </button>

                    <ul className="list-none hidden sm:flex flex-row gap-10">
                        {navLinks.map((link) => (
                            <li
                                key={link.id}
                                className={`${
                                    active === link.title
                                        ? "text-white"
                                        : "text-secondary"
                                } " hover:text-white cursor-pointer font-bold text-[18px]"`}
                            >
                                <a href={`#${link.id}`}>{link.title}</a>
                            </li>
                        ))}
                    </ul>
                    <div className="sm:hidden flex flex-1 justify-end items-center">
                        <img
                            src={toggle ? close : menu}
                            alt="menu"
                            className="w-[28px] h-[28px] object-contain cursor-pointer"
                            onClick={() => setToggle(!toggle)}
                        />
                        <div
                            className={`${
                                !toggle ? "hidden" : "flex"
                            } p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}
                        >
                            <ul className="list-none flex justify-end items-start flex-col gap-4">
                                {navLinks.map((link) => (
                                    <li
                                        key={link.id}
                                        className={`${
                                            active === link.title
                                                ? "text-white"
                                                : "text-secondary"
                                        } " font-poppins font-medium cursor-pointer text-[16px]"`}
                                        onClick={() => {
                                            setToggle(!toggle);
                                            setActive(link.title);
                                        }}
                                    >
                                        <a href={`#${link.id}`}>{link.title}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
