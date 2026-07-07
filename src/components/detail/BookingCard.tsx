"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./BookingCard.module.css";
import CalendarMonth from "@/components/common/Header/SearchBar/CalendarMonth";

interface BookingCardProps {
  price: number;
  dateRangeLabel?: string;
}

type GuestKey = "adults" | "children" | "infants" | "pets";
type Guests = Record<GuestKey, number>;

const GUEST_ROWS: { key: GuestKey; label: string; sub: string }[] = [
  { key: "adults", label: "성인", sub: "13세 이상" },
  { key: "children", label: "어린이", sub: "2~12세" },
  { key: "infants", label: "유아", sub: "2세 미만" },
  { key: "pets", label: "반려동물", sub: "보조동물을 동반하시나요?" },
];

const CAL_MAX_OFFSET = 23;

const PROMO_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 148 148" width="148" height="148" preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px); content-visibility: visible;"><defs><clipPath id="main__lottie_element_174"><rect width="148" height="148" x="0" y="0"></rect></clipPath><clipPath id="main__lottie_element_176"><path d="M0,0 L1000,0 L1000,1000 L0,1000z"></path></clipPath><filter id="main__lottie_element_182" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" result="filter_result_0_drop_shadow_1" stdDeviation="2.5"></feGaussianBlur><feOffset dx="-0.4357787137382912" dy="4.9809734904587275" in="filter_result_0_drop_shadow_1" result="filter_result_0_drop_shadow_2"></feOffset><feFlood flood-color="#000000" flood-opacity="0.5" result="filter_result_0_drop_shadow_3"></feFlood><feComposite in="filter_result_0_drop_shadow_3" in2="filter_result_0_drop_shadow_2" operator="in" result="filter_result_0_drop_shadow_4"></feComposite><feMerge result="filter_result_0"><feMergeNode in="filter_result_0_drop_shadow_4"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter><linearGradient id="main__lottie_element_183" spreadMethod="pad" gradientUnits="userSpaceOnUse" x1="-303.635009765625" y1="-176.3979949951172" x2="-129.0679931640625" y2="-174.4980010986328"><stop offset="0%" stop-color="rgb(245,237,231)"></stop><stop offset="45%" stop-color="rgb(232,217,209)"></stop><stop offset="90%" stop-color="rgb(219,197,186)"></stop><stop offset="95%" stop-color="rgb(113,100,94)"></stop><stop offset="100%" stop-color="rgb(8,3,3)"></stop></linearGradient><filter id="main__lottie_element_185" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" result="filter_result_0_drop_shadow_1" stdDeviation="2.75"></feGaussianBlur><feOffset dx="-2.9301133901144096" dy="-8.509667180393851" in="filter_result_0_drop_shadow_1" result="filter_result_0_drop_shadow_2"></feOffset><feFlood flood-color="#8a7871" flood-opacity="1" result="filter_result_0_drop_shadow_3"></feFlood><feComposite in="filter_result_0_drop_shadow_3" in2="filter_result_0_drop_shadow_2" operator="in" result="filter_result_0_drop_shadow_4"></feComposite><feMerge result="filter_result_0"><feMergeNode in="filter_result_0_drop_shadow_4"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter><linearGradient id="main__lottie_element_186" spreadMethod="pad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="-170" y2="0"><stop offset="0%" stop-color="rgb(137,120,112)"></stop><stop offset="35%" stop-color="rgb(89,77,72)"></stop><stop offset="71%" stop-color="rgb(41,33,31)"></stop><stop offset="78%" stop-color="rgb(89,76,72)"></stop><stop offset="86%" stop-color="rgb(136,119,112)"></stop></linearGradient><filter id="main__lottie_element_190" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" result="filter_result_0_drop_shadow_1" stdDeviation="30"></feGaussianBlur><feOffset dx="-22.229067854687916" dy="23.018873610836835" in="filter_result_0_drop_shadow_1" result="filter_result_0_drop_shadow_2"></feOffset><feFlood flood-color="#022c00" flood-opacity="0.35" result="filter_result_0_drop_shadow_3"></feFlood><feComposite in="filter_result_0_drop_shadow_3" in2="filter_result_0_drop_shadow_2" operator="in" result="filter_result_0_drop_shadow_4"></feComposite><feMerge result="filter_result_0"><feMergeNode in="filter_result_0_drop_shadow_4"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter><linearGradient id="main__lottie_element_191" spreadMethod="pad" gradientUnits="userSpaceOnUse" x1="0" y1="-272" x2="0" y2="287"><stop offset="0%" stop-color="rgb(104,195,100)"></stop><stop offset="12%" stop-color="rgb(96,181,93)"></stop><stop offset="23%" stop-color="rgb(89,167,85)"></stop><stop offset="40%" stop-color="rgb(85,159,82)"></stop><stop offset="57%" stop-color="rgb(81,152,78)"></stop><stop offset="71%" stop-color="rgb(81,152,78)"></stop><stop offset="86%" stop-color="rgb(81,152,78)"></stop><stop offset="88%" stop-color="rgb(86,161,82)"></stop><stop offset="91%" stop-color="rgb(91,169,87)"></stop><stop offset="94%" stop-color="rgb(103,188,99)"></stop><stop offset="96%" stop-color="rgb(114,207,110)"></stop></linearGradient><filter id="main__lottie_element_193" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" result="filter_result_0_drop_shadow_1" stdDeviation="7.5"></feGaussianBlur><feOffset dx="1.2246467991473533e-15" dy="20" in="filter_result_0_drop_shadow_1" result="filter_result_0_drop_shadow_2"></feOffset><feFlood flood-color="#000000" flood-opacity="0.3" result="filter_result_0_drop_shadow_3"></feFlood><feComposite in="filter_result_0_drop_shadow_3" in2="filter_result_0_drop_shadow_2" operator="in" result="filter_result_0_drop_shadow_4"></feComposite><feMerge result="filter_result_0"><feMergeNode in="filter_result_0_drop_shadow_4"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter><radialGradient id="main__lottie_element_194" spreadMethod="pad" gradientUnits="userSpaceOnUse" cx="-0.5" cy="-1" r="48.610285451584964" fx="-0.5" fy="-1"><stop offset="59%" stop-color="rgb(101,77,55)"></stop><stop offset="62%" stop-color="rgb(177,155,116)"></stop><stop offset="65%" stop-color="rgb(254,234,177)"></stop><stop offset="67%" stop-color="rgb(254,238,193)"></stop><stop offset="69%" stop-color="rgb(255,242,209)"></stop><stop offset="74%" stop-color="rgb(244,222,166)"></stop><stop offset="80%" stop-color="rgb(233,201,123)"></stop><stop offset="85%" stop-color="rgb(244,223,161)"></stop><stop offset="91%" stop-color="rgb(255,245,199)"></stop><stop offset="93%" stop-color="rgb(255,244,197)"></stop><stop offset="95%" stop-color="rgb(255,243,195)"></stop><stop offset="97%" stop-color="rgb(205,154,120)"></stop><stop offset="100%" stop-color="rgb(155,66,44)"></stop></radialGradient><linearGradient id="main__lottie_element_198" spreadMethod="pad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="0"><stop offset="0%" stop-color="rgb(245,237,231)"></stop><stop offset="44%" stop-color="rgb(232,217,209)"></stop><stop offset="88%" stop-color="rgb(219,197,186)"></stop><stop offset="94%" stop-color="rgb(113,100,94)"></stop><stop offset="100%" stop-color="rgb(8,3,3)"></stop></linearGradient><filter id="main__lottie_element_204" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" result="filter_result_0_drop_shadow_1" stdDeviation="8"></feGaussianBlur><feOffset dx="-3.9068178534858795" dy="11.346222907191802" in="filter_result_0_drop_shadow_1" result="filter_result_0_drop_shadow_2"></feOffset><feFlood flood-color="#000000" flood-opacity="0.25" result="filter_result_0_drop_shadow_3"></feFlood><feComposite in="filter_result_0_drop_shadow_3" in2="filter_result_0_drop_shadow_2" operator="in" result="filter_result_0_drop_shadow_4"></feComposite><feMerge result="filter_result_0"><feMergeNode in="filter_result_0_drop_shadow_4"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter><linearGradient id="main__lottie_element_205" spreadMethod="pad" gradientUnits="userSpaceOnUse" x1="0" y1="-272" x2="0" y2="287"><stop offset="0%" stop-color="rgb(246,80,125)"></stop><stop offset="42%" stop-color="rgb(240,62,113)"></stop><stop offset="85%" stop-color="rgb(235,44,102)"></stop><stop offset="90%" stop-color="rgb(245,84,134)"></stop><stop offset="95%" stop-color="rgb(255,124,165)"></stop></linearGradient><filter id="main__lottie_element_208" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" result="filter_result_0_drop_shadow_1" stdDeviation="4.5"></feGaussianBlur><feOffset dx="-1.9534089267429398" dy="5.673111453595901" in="filter_result_0_drop_shadow_1" result="filter_result_0_drop_shadow_2"></feOffset><feFlood flood-color="#000000" flood-opacity="0.25" result="filter_result_0_drop_shadow_3"></feFlood><feComposite in="filter_result_0_drop_shadow_3" in2="filter_result_0_drop_shadow_2" operator="in" result="filter_result_0_drop_shadow_4"></feComposite><feMerge result="filter_result_0"><feMergeNode in="filter_result_0_drop_shadow_4"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter><linearGradient id="main__lottie_element_209" spreadMethod="pad" gradientUnits="userSpaceOnUse" x1="-257" y1="0" x2="291" y2="0"><stop offset="0%" stop-color="rgb(226,226,226)"></stop><stop offset="50%" stop-color="rgb(219,219,219)"></stop><stop offset="100%" stop-color="rgb(212,212,212)"></stop></linearGradient><filter id="main__lottie_element_212" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" result="filter_result_0_drop_shadow_1" stdDeviation="4.5"></feGaussianBlur><feOffset dx="2.8678821817552307" dy="-4.095760221444959" in="filter_result_0_drop_shadow_1" result="filter_result_0_drop_shadow_2"></feOffset><feFlood flood-color="#85746d" flood-opacity="0.996078431372549" result="filter_result_0_drop_shadow_3"></feFlood><feComposite in="filter_result_0_drop_shadow_3" in2="filter_result_0_drop_shadow_2" operator="in" result="filter_result_0_drop_shadow_4"></feComposite><feMerge result="filter_result_0"><feMergeNode in="filter_result_0_drop_shadow_4"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter><filter id="main__lottie_element_215" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" result="filter_result_0_drop_shadow_1" stdDeviation="2.5"></feGaussianBlur><feOffset dx="3.5355339059327378" dy="3.5355339059327373" in="filter_result_0_drop_shadow_1" result="filter_result_0_drop_shadow_2"></feOffset><feFlood flood-color="#000000" flood-opacity="0.5" result="filter_result_0_drop_shadow_3"></feFlood><feComposite in="filter_result_0_drop_shadow_3" in2="filter_result_0_drop_shadow_2" operator="in" result="filter_result_0_drop_shadow_4"></feComposite><feMerge result="filter_result_0"><feMergeNode in="filter_result_0_drop_shadow_4"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter></defs><g clip-path="url(#main__lottie_element_174)"><g clip-path="url(#main__lottie_element_176)" transform="matrix(0.14800000190734863,0,0,0.14800000190734863,0,0)" opacity="1" style="display: block;"><g filter="url(#main__lottie_element_215)" transform="matrix(1,0,0,1,500,500)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4" stroke="rgb(245,237,231)" stroke-opacity="1" stroke-width="24" d=" M-298.75,-314 C-282.75,-321 -234,-274 -184,-210"></path></g></g><g filter="url(#main__lottie_element_212)" transform="matrix(1,0,0,1,500,500)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(137,120,112)" fill-opacity="1" d=" M-292,-300.5 C-265.5,-290 -228,-243 -204,-216 C-191,-212.5 -203,-218.5 -203,-218.5 C-203,-218.5 -232,-272.5 -260,-297 C-287.7539978027344,-321.28399658203125 -288,-310.5 -292,-300.5z"></path></g></g><g filter="url(#main__lottie_element_208)" transform="matrix(0.9836598634719849,0.1800367534160614,-0.1800367534160614,0.9836598634719849,452.9935302734375,554.197021484375)" opacity="1" style="display: block;"><path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4" stroke="rgb(249,242,238)" stroke-opacity="1" stroke-width="3" d=" M-123.9530029296875,-219.40199279785156 C-107.20099639892578,-219.40199279785156 -93.62000274658203,-205.8209991455078 -93.62000274658203,-189.06900024414062 C-93.62000274658203,-172.31700134277344 -107.20099639892578,-158.73599243164062 -123.9530029296875,-158.73599243164062 C-140.7050018310547,-158.73599243164062 -154.28599548339844,-172.31700134277344 -154.28599548339844,-189.06900024414062 C-154.28599548339844,-205.8209991455078 -140.7050018310547,-219.40199279785156 -123.9530029296875,-219.40199279785156z M22.104000091552734,-272.8009948730469 C22.104000091552734,-272.8009948730469 -195.42300415039062,-266.510009765625 -195.42300415039062,-266.510009765625 C-223.2969970703125,-265.7040100097656 -245.70399475097656,-243.2969970703125 -246.50999450683594,-215.42300415039062 C-246.50999450683594,-215.42300415039062 -252.80099487304688,2.1040000915527344 -252.80099487304688,2.1040000915527344 C-253.25100708007812,17.67099952697754 -247.26499938964844,32.73500061035156 -236.2530059814453,43.74700164794922 C-236.2530059814453,43.74700164794922 -23.812000274658203,256.5570068359375 -23.812000274658203,256.5570068359375 C-4.531000137329102,275.8380126953125 26.731000900268555,275.8380126953125 46.012001037597656,256.5570068359375 C46.012001037597656,256.5570068359375 97.01000213623047,206.49400329589844 155.82000732421875,146.74899291992188 C214.23599243164062,87.40499877929688 266.8689880371094,16.076000213623047 266.8689880371094,16.076000213623047 C286.1390075683594,-3.193000078201294 286.1390075683594,-34.433998107910156 266.8689880371094,-53.702999114990234 C266.8689880371094,-53.702999114990234 63.74700164794922,-256.25299072265625 63.74700164794922,-256.25299072265625 C52.73500061035156,-267.2650146484375 37.67100143432617,-273.2510070800781 22.104000091552734,-272.8009948730469z"></path><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="url(#main__lottie_element_209)" fill-opacity="1" d=" M-123.9530029296875,-219.40199279785156 C-107.20099639892578,-219.40199279785156 -93.62000274658203,-205.8209991455078 -93.62000274658203,-189.06900024414062 C-93.62000274658203,-172.31700134277344 -107.20099639892578,-158.73599243164062 -123.9530029296875,-158.73599243164062 C-140.7050018310547,-158.73599243164062 -154.28599548339844,-172.31700134277344 -154.28599548339844,-189.06900024414062 C-154.28599548339844,-205.8209991455078 -140.7050018310547,-219.40199279785156 -123.9530029296875,-219.40199279785156z M22.104000091552734,-272.8009948730469 C22.104000091552734,-272.8009948730469 -195.42300415039062,-266.510009765625 -195.42300415039062,-266.510009765625 C-223.2969970703125,-265.7040100097656 -245.70399475097656,-243.2969970703125 -246.50999450683594,-215.42300415039062 C-246.50999450683594,-215.42300415039062 -252.80099487304688,2.1040000915527344 -252.80099487304688,2.1040000915527344 C-253.25100708007812,17.67099952697754 -247.26499938964844,32.73500061035156 -236.2530059814453,43.74700164794922 C-236.2530059814453,43.74700164794922 -23.812000274658203,256.5570068359375 -23.812000274658203,256.5570068359375 C-4.531000137329102,275.8380126953125 26.731000900268555,275.8380126953125 46.012001037597656,256.5570068359375 C46.012001037597656,256.5570068359375 97.01000213623047,206.49400329589844 155.82000732421875,146.74899291992188 C214.23599243164062,87.40499877929688 266.8689880371094,16.076000213623047 266.8689880371094,16.076000213623047 C286.1390075683594,-3.193000078201294 286.1390075683594,-34.433998107910156 266.8689880371094,-53.702999114990234 C266.8689880371094,-53.702999114990234 63.74700164794922,-256.25299072265625 63.74700164794922,-256.25299072265625 C52.73500061035156,-267.2650146484375 37.67100143432617,-273.2510070800781 22.104000091552734,-272.8009948730469z"></path></g></g><g filter="url(#main__lottie_element_204)" transform="matrix(1,0.00010817421571118757,-0.00010817421571118757,1,499.98333740234375,500.0145263671875)" opacity="0.99" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="url(#main__lottie_element_205)" fill-opacity="1" d=" M-134.9530029296875,-184.40199279785156 C-118.20099639892578,-184.40199279785156 -104.62000274658203,-170.8209991455078 -104.62000274658203,-154.06900024414062 C-104.62000274658203,-137.31700134277344 -118.20099639892578,-123.73600006103516 -134.9530029296875,-123.73600006103516 C-151.7050018310547,-123.73600006103516 -165.28599548339844,-137.31700134277344 -165.28599548339844,-154.06900024414062 C-165.28599548339844,-170.8209991455078 -151.7050018310547,-184.40199279785156 -134.9530029296875,-184.40199279785156z M22.104000091552734,-272.8009948730469 C22.104000091552734,-272.8009948730469 -195.42300415039062,-266.510009765625 -195.42300415039062,-266.510009765625 C-223.2969970703125,-265.7040100097656 -245.70399475097656,-243.2969970703125 -246.50999450683594,-215.42300415039062 C-246.50999450683594,-215.42300415039062 -252.80099487304688,2.1040000915527344 -252.80099487304688,2.1040000915527344 C-253.25100708007812,17.67099952697754 -247.26499938964844,32.73500061035156 -236.2530059814453,43.74700164794922 C-236.2530059814453,43.74700164794922 -8.331000328063965,271.66900634765625 -8.331000328063965,271.66900634765625 C10.949999809265137,290.95001220703125 42.21200180053711,290.95001220703125 61.49300003051758,271.66900634765625 C61.49300003051758,271.66900634765625 291.6910095214844,41.470001220703125 291.6910095214844,41.470001220703125 C310.9599914550781,22.201000213623047 310.9599914550781,-9.039999961853027 291.6910095214844,-28.30900001525879 C291.6910095214844,-28.30900001525879 63.74700164794922,-256.25299072265625 63.74700164794922,-256.25299072265625 C52.73500061035156,-267.2650146484375 37.67100143432617,-273.2510070800781 22.104000091552734,-272.8009948730469z"></path></g></g><g transform="matrix(1,0.00010817421571118757,-0.00010817421571118757,1,501.9831237792969,502.0147705078125)" opacity="0.99" style="display: block;"><path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4" stroke="rgb(78,144,76)" stroke-opacity="1" stroke-width="3" d=" M-134.9530029296875,-184.40199279785156 C-118.20099639892578,-184.40199279785156 -104.62000274658203,-170.8209991455078 -104.62000274658203,-154.06900024414062 C-104.62000274658203,-137.31700134277344 -118.20099639892578,-123.73600006103516 -134.9530029296875,-123.73600006103516 C-151.7050018310547,-123.73600006103516 -165.28599548339844,-137.31700134277344 -165.28599548339844,-154.06900024414062 C-165.28599548339844,-170.8209991455078 -151.7050018310547,-184.40199279785156 -134.9530029296875,-184.40199279785156z M22.104000091552734,-272.8009948730469 C22.104000091552734,-272.8009948730469 -195.42300415039062,-266.510009765625 -195.42300415039062,-266.510009765625 C-223.2969970703125,-265.7040100097656 -245.70399475097656,-243.2969970703125 -246.50999450683594,-215.42300415039062 C-246.50999450683594,-215.42300415039062 -252.80099487304688,2.1040000915527344 -252.80099487304688,2.1040000915527344 C-253.25100708007812,17.67099952697754 -247.26499938964844,32.73500061035156 -236.2530059814453,43.74700164794922 C-236.2530059814453,43.74700164794922 -8.331000328063965,271.66900634765625 -8.331000328063965,271.66900634765625 C10.949999809265137,290.95001220703125 42.21200180053711,290.95001220703125 61.49300003051758,271.66900634765625 C61.49300003051758,271.66900634765625 291.6910095214844,41.470001220703125 291.6910095214844,41.470001220703125 C310.9599914550781,22.201000213623047 310.9599914550781,-9.039999961853027 291.6910095214844,-28.30900001525879 C291.6910095214844,-28.30900001525879 63.74700164794922,-256.25299072265625 63.74700164794922,-256.25299072265625 C52.73500061035156,-267.2650146484375 37.67100143432617,-273.2510070800781 22.104000091552734,-272.8009948730469z"></path><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(49,84,48)" fill-opacity="1" d=" M-134.9530029296875,-184.40199279785156 C-118.20099639892578,-184.40199279785156 -104.62000274658203,-170.8209991455078 -104.62000274658203,-154.06900024414062 C-104.62000274658203,-137.31700134277344 -118.20099639892578,-123.73600006103516 -134.9530029296875,-123.73600006103516 C-151.7050018310547,-123.73600006103516 -165.28599548339844,-137.31700134277344 -165.28599548339844,-154.06900024414062 C-165.28599548339844,-170.8209991455078 -151.7050018310547,-184.40199279785156 -134.9530029296875,-184.40199279785156z M22.104000091552734,-272.8009948730469 C22.104000091552734,-272.8009948730469 -195.42300415039062,-266.510009765625 -195.42300415039062,-266.510009765625 C-223.2969970703125,-265.7040100097656 -245.70399475097656,-243.2969970703125 -246.50999450683594,-215.42300415039062 C-246.50999450683594,-215.42300415039062 -252.80099487304688,2.1040000915527344 -252.80099487304688,2.1040000915527344 C-253.25100708007812,17.67099952697754 -247.26499938964844,32.73500061035156 -236.2530059814453,43.74700164794922 C-236.2530059814453,43.74700164794922 -8.331000328063965,271.66900634765625 -8.331000328063965,271.66900634765625 C10.949999809265137,290.95001220703125 42.21200180053711,290.95001220703125 61.49300003051758,271.66900634765625 C61.49300003051758,271.66900634765625 291.6910095214844,41.470001220703125 291.6910095214844,41.470001220703125 C310.9599914550781,22.201000213623047 310.9599914550781,-9.039999961853027 291.6910095214844,-28.30900001525879 C291.6910095214844,-28.30900001525879 63.74700164794922,-256.25299072265625 63.74700164794922,-256.25299072265625 C52.73500061035156,-267.2650146484375 37.67100143432617,-273.2510070800781 22.104000091552734,-272.8009948730469z"></path></g></g><g filter="url(#main__lottie_element_190)" transform="matrix(1,0.00010817421571118757,-0.00010817421571118757,1,499.98333740234375,500.0145263671875)" opacity="0.99" style="display: block;"><path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4" stroke="rgb(78,144,76)" stroke-opacity="1" stroke-width="3" d=" M-134.9530029296875,-184.40199279785156 C-118.20099639892578,-184.40199279785156 -104.62000274658203,-170.8209991455078 -104.62000274658203,-154.06900024414062 C-104.62000274658203,-137.31700134277344 -118.20099639892578,-123.73600006103516 -134.9530029296875,-123.73600006103516 C-151.7050018310547,-123.73600006103516 -165.28599548339844,-137.31700134277344 -165.28599548339844,-154.06900024414062 C-165.28599548339844,-170.8209991455078 -151.7050018310547,-184.40199279785156 -134.9530029296875,-184.40199279785156z M22.104000091552734,-272.8009948730469 C22.104000091552734,-272.8009948730469 -195.42300415039062,-266.510009765625 -195.42300415039062,-266.510009765625 C-223.2969970703125,-265.7040100097656 -245.70399475097656,-243.2969970703125 -246.50999450683594,-215.42300415039062 C-246.50999450683594,-215.42300415039062 -252.80099487304688,2.1040000915527344 -252.80099487304688,2.1040000915527344 C-253.25100708007812,17.67099952697754 -247.26499938964844,32.73500061035156 -236.2530059814453,43.74700164794922 C-236.2530059814453,43.74700164794922 -8.331000328063965,271.66900634765625 -8.331000328063965,271.66900634765625 C10.949999809265137,290.95001220703125 42.21200180053711,290.95001220703125 61.49300003051758,271.66900634765625 C61.49300003051758,271.66900634765625 291.6910095214844,41.470001220703125 291.6910095214844,41.470001220703125 C310.9599914550781,22.201000213623047 310.9599914550781,-9.039999961853027 291.6910095214844,-28.30900001525879 C291.6910095214844,-28.30900001525879 63.74700164794922,-256.25299072265625 63.74700164794922,-256.25299072265625 C52.73500061035156,-267.2650146484375 37.67100143432617,-273.2510070800781 22.104000091552734,-272.8009948730469z"></path><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="url(#main__lottie_element_191)" fill-opacity="1" d=" M-134.9530029296875,-184.40199279785156 C-118.20099639892578,-184.40199279785156 -104.62000274658203,-170.8209991455078 -104.62000274658203,-154.06900024414062 C-104.62000274658203,-137.31700134277344 -118.20099639892578,-123.73600006103516 -134.9530029296875,-123.73600006103516 C-151.7050018310547,-123.73600006103516 -165.28599548339844,-137.31700134277344 -165.28599548339844,-154.06900024414062 C-165.28599548339844,-170.8209991455078 -151.7050018310547,-184.40199279785156 -134.9530029296875,-184.40199279785156z M22.104000091552734,-272.8009948730469 C22.104000091552734,-272.8009948730469 -195.42300415039062,-266.510009765625 -195.42300415039062,-266.510009765625 C-223.2969970703125,-265.7040100097656 -245.70399475097656,-243.2969970703125 -246.50999450683594,-215.42300415039062 C-246.50999450683594,-215.42300415039062 -252.80099487304688,2.1040000915527344 -252.80099487304688,2.1040000915527344 C-253.25100708007812,17.67099952697754 -247.26499938964844,32.73500061035156 -236.2530059814453,43.74700164794922 C-236.2530059814453,43.74700164794922 -8.331000328063965,271.66900634765625 -8.331000328063965,271.66900634765625 C10.949999809265137,290.95001220703125 42.21200180053711,290.95001220703125 61.49300003051758,271.66900634765625 C61.49300003051758,271.66900634765625 291.6910095214844,41.470001220703125 291.6910095214844,41.470001220703125 C310.9599914550781,22.201000213623047 310.9599914550781,-9.039999961853027 291.6910095214844,-28.30900001525879 C291.6910095214844,-28.30900001525879 63.74700164794922,-256.25299072265625 63.74700164794922,-256.25299072265625 C52.73500061035156,-267.2650146484375 37.67100143432617,-273.2510070800781 22.104000091552734,-272.8009948730469z"></path></g></g><g transform="matrix(1,0.00010817421571118757,-0.00010817421571118757,1,499.9832458496094,500.7645263671875)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,-134.99200439453125,-154.82400512695312)"><path fill="rgb(255,255,255)" fill-opacity="1" d=" M0,-27.4689998626709 C15.160140991210938,-27.4689998626709 27.4689998626709,-15.160140991210938 27.4689998626709,0 C27.4689998626709,15.160140991210938 15.160140991210938,27.4689998626709 0,27.4689998626709 C-15.160140991210938,27.4689998626709 -27.4689998626709,15.160140991210938 -27.4689998626709,0 C-27.4689998626709,-15.160140991210938 -15.160140991210938,-27.4689998626709 0,-27.4689998626709z"></path><path stroke="url(#main__lottie_element_198)" stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4" stroke-opacity="1" stroke-width="0" d=" M0,-27.4689998626709 C15.160140991210938,-27.4689998626709 27.4689998626709,-15.160140991210938 27.4689998626709,0 C27.4689998626709,15.160140991210938 15.160140991210938,27.4689998626709 0,27.4689998626709 C-15.160140991210938,27.4689998626709 -27.4689998626709,15.160140991210938 -27.4689998626709,0 C-27.4689998626709,-15.160140991210938 -15.160140991210938,-27.4689998626709 0,-27.4689998626709z"></path></g></g><g filter="url(#main__lottie_element_193)" transform="matrix(1,0.00010817421571118757,-0.00010817421571118757,1,365,345.99993896484375)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path stroke="url(#main__lottie_element_194)" stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4" stroke-opacity="1" stroke-width="20" d=" M0,-38 C20.98699951171875,-38 38,-20.98699951171875 38,0 C38,20.98699951171875 20.98699951171875,38 0,38 C-20.98699951171875,38 -38,20.98699951171875 -38,0 C-38,-20.98699951171875 -20.98699951171875,-38 0,-38z"></path></g></g><g filter="url(#main__lottie_element_182)" transform="matrix(1,0,0,1,500.5,500.5)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path stroke="url(#main__lottie_element_183)" stroke-linecap="round" stroke-linejoin="round" fill-opacity="0" stroke-opacity="1" stroke-width="24" d=" M-130.5,-170.75 C-143.5,-162.25 -198.5,-177 -244.5,-211.5 C-290.5,-246 -315.5,-291 -299.5,-315"></path></g></g></g><g filter="url(#main__lottie_element_185)" transform="matrix(1,0,0,1,500.5,500.5)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="url(#main__lottie_element_186)" fill-opacity="0.76" d=" M-290.375,-238.25 C-268.75,-213.5 -244.75,-193.75 -213,-178 C-166.0260009765625,-154.697998046875 -141.21800231933594,-154.11199951171875 -126.125,-159.875 C-112.375,-165.125 -121,-181 -132.5,-177 C-144,-173 -168.57400512695312,-165.36199951171875 -221,-192.5 C-263.5,-214.5 -274.25,-225 -290.375,-238.25z"></path></g></g></g></g></svg>`;

function formatDate(d: Date) {
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function formatDateWithYear(d: Date) {
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function formatDateDots(d: Date) {
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`;
}

function getToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseDateRangeLabel(label: string | undefined, today: Date): { start: Date; end: Date } | null {
  if (!label) return null;
  const match = label.match(/(\d+)월\s*(\d+)일~(\d+)일/);
  if (!match) return null;
  const month = Number(match[1]) - 1;
  const startDay = Number(match[2]);
  const endDay = Number(match[3]);
  let year = today.getFullYear();
  let start = new Date(year, month, startDay);
  if (start < today) {
    year += 1;
    start = new Date(year, month, startDay);
  }
  return { start, end: new Date(year, month, endDay) };
}

export default function BookingCard({ price, dateRangeLabel }: BookingCardProps) {
  const today = getToday();
  const initialRange = parseDateRangeLabel(dateRangeLabel, today);

  const [activePopup, setActivePopup] = useState<"date" | "guests" | null>(null);
  const [selectedStart, setSelectedStart] = useState<Date | null>(initialRange?.start ?? null);
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(initialRange?.end ?? null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [calOffset, setCalOffset] = useState(() =>
    initialRange
      ? (initialRange.start.getFullYear() - today.getFullYear()) * 12 +
        (initialRange.start.getMonth() - today.getMonth())
      : 0
  );
  const [guests, setGuests] = useState<Guests>({ adults: 0, children: 0, infants: 0, pets: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const calLeft = new Date(today.getFullYear(), today.getMonth() + calOffset, 1);
  const calRight = new Date(today.getFullYear(), today.getMonth() + calOffset + 1, 1);

  const nights =
    selectedStart && selectedEnd
      ? Math.round((selectedEnd.getTime() - selectedStart.getTime()) / 86400000)
      : 0;

  const totalGuests = guests.adults + guests.children + guests.infants + guests.pets;

  useEffect(() => {
    if (!activePopup) return;
    function onClickOutside(e: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setActivePopup(null);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [activePopup]);

  function handleDayClick(d: Date) {
    if (!selectedStart || selectedEnd) {
      setSelectedStart(d);
      setSelectedEnd(null);
    } else if (d < selectedStart) {
      setSelectedEnd(selectedStart);
      setSelectedStart(d);
    } else if (d > selectedStart) {
      setSelectedEnd(d);
    }
  }

  function adjustGuest(key: GuestKey, delta: number) {
    setGuests((g) => ({ ...g, [key]: Math.max(0, g[key] + delta) }));
  }

  function toggleDatePopup() {
    setActivePopup((p) => (p === "date" ? null : "date"));
  }

  return (
    <>
      <div className={styles.promoCard}>
        <div className={styles.promoIcon} dangerouslySetInnerHTML={{ __html: PROMO_ICON_SVG }} />
        <div className={styles.promoContent}>
          <p className={styles.promoTitle}>₩155,000 더 내고 1박 추가</p>
          <p className={styles.promoDesc}>특별가 혜택을 받아 숙박 기간을 9월 21일까지 연장해보세요.</p>
          <button type="button" className={styles.promoLink}>
            1박 추가
          </button>
        </div>
      </div>

      <div className={styles.card} ref={cardRef}>
        <p className={styles.totalRow}>총액 ₩{price.toLocaleString()}</p>

        <div className={styles.fieldsWrapper}>
          <div className={styles.fieldsBox}>
            <div className={styles.fieldsRow}>
              <button type="button" className={styles.field} onClick={toggleDatePopup}>
                <span className={styles.fieldLabel}>체크인</span>
                <span className={styles.fieldValue}>{selectedStart ? formatDate(selectedStart) : "날짜 추가"}</span>
              </button>
              <button type="button" className={styles.field} onClick={toggleDatePopup}>
                <span className={styles.fieldLabel}>체크아웃</span>
                <span className={styles.fieldValue}>{selectedEnd ? formatDate(selectedEnd) : "날짜 추가"}</span>
              </button>
            </div>
            <button
              type="button"
              className={styles.guestField}
              onClick={() => setActivePopup((p) => (p === "guests" ? null : "guests"))}
            >
              <span className={styles.fieldLabel}>인원</span>
              <span className={styles.fieldValue}>게스트 {totalGuests || 1}명</span>
            </button>
          </div>

          {activePopup === "date" && (
            <div className={styles.calendarPopup}>
              <div className={styles.calendarTopRow}>
                <div className={styles.calendarNights}>
                  <p className={styles.calendarNightsCount}>{nights > 0 ? `${nights}박` : "날짜 선택"}</p>
                  {selectedStart && (
                    <p className={styles.calendarNightsRange}>
                      {formatDateWithYear(selectedStart)}
                      {selectedEnd ? ` - ${formatDateWithYear(selectedEnd)}` : ""}
                    </p>
                  )}
                </div>
                <div className={styles.calendarInputs}>
                  <div className={styles.calendarInputBox}>
                    <span className={styles.calendarInputLabel}>체크인</span>
                    <div className={styles.calendarInputRow}>
                      <span className={styles.calendarInputValue}>
                        {selectedStart ? formatDateDots(selectedStart) : ""}
                      </span>
                      <button
                        type="button"
                        className={styles.calendarInputClear}
                        aria-label="캘린더 닫기"
                        onClick={() => setActivePopup(null)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" focusable="false" style={{ display: "block", fill: "none", height: "10px", width: "10px", stroke: "currentcolor", strokeWidth: 4, overflow: "visible" }}>
                          <path d="m6 6 20 20M26 6 6 26" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className={styles.calendarInputBox}>
                    <span className={styles.calendarInputLabel}>체크아웃</span>
                    <div className={styles.calendarInputRow}>
                      <span className={styles.calendarInputValue}>
                        {selectedEnd ? formatDateDots(selectedEnd) : ""}
                      </span>
                      <button
                        type="button"
                        className={styles.calendarInputClear}
                        aria-label="캘린더 닫기"
                        onClick={() => setActivePopup(null)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" focusable="false" style={{ display: "block", fill: "none", height: "10px", width: "10px", stroke: "currentcolor", strokeWidth: 4, overflow: "visible" }}>
                          <path d="m6 6 20 20M26 6 6 26" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.calendarBody}>
                <CalendarMonth
                  year={calLeft.getFullYear()}
                  month={calLeft.getMonth()}
                  today={today}
                  selectedStart={selectedStart}
                  selectedEnd={selectedEnd}
                  hovered={hoveredDate}
                  onDayClick={handleDayClick}
                  onDayHover={setHoveredDate}
                  showPrev
                  prevDisabled={calOffset === 0}
                  onPrev={() => setCalOffset((o) => o - 1)}
                />
                <CalendarMonth
                  year={calRight.getFullYear()}
                  month={calRight.getMonth()}
                  today={today}
                  selectedStart={selectedStart}
                  selectedEnd={selectedEnd}
                  hovered={hoveredDate}
                  onDayClick={handleDayClick}
                  onDayHover={setHoveredDate}
                  showNext
                  nextDisabled={calOffset >= CAL_MAX_OFFSET}
                  onNext={() => setCalOffset((o) => o + 1)}
                />
              </div>
              <div className={styles.calendarFooter}>
                <button type="button" className={styles.calendarKeyboardBtn} aria-label="키보드로 날짜 입력">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" focusable="false" style={{ display: "block", fill: "none", height: "14px", width: "14px", stroke: "currentcolor", strokeWidth: 2, overflow: "visible" }}>
                    <rect x="2" y="8" width="28" height="18" rx="2" />
                    <path d="M7 14h.01M12 14h.01M17 14h.01M22 14h.01M25 14h.01M7 19h.01M25 19h.01M12 19h8" />
                  </svg>
                </button>
                <div className={styles.calendarFooterRight}>
                  <button
                    type="button"
                    className={styles.calendarClearBtn}
                    onClick={() => {
                      setSelectedStart(null);
                      setSelectedEnd(null);
                    }}
                  >
                    날짜 지우기
                  </button>
                  <button type="button" className={styles.calendarCloseBtn} onClick={() => setActivePopup(null)}>
                    닫기
                  </button>
                </div>
              </div>
            </div>
          )}

          {activePopup === "guests" && (
            <div className={styles.guestPopup}>
              {GUEST_ROWS.map((row) => (
                <div key={row.key} className={styles.guestRow}>
                  <div>
                    <div className={styles.guestLabel}>{row.label}</div>
                    <div className={styles.guestSub}>{row.sub}</div>
                  </div>
                  <div className={styles.guestCounter}>
                    <button
                      type="button"
                      className={styles.counterBtn}
                      onClick={() => adjustGuest(row.key, -1)}
                      disabled={guests[row.key] === 0}
                    >
                      −
                    </button>
                    <span className={styles.counterVal}>{guests[row.key]}</span>
                    <button type="button" className={styles.counterBtn} onClick={() => adjustGuest(row.key, 1)}>
                      +
                    </button>
                  </div>
                </div>
              ))}
              <p className={styles.guestNote}>
                이 숙소의 최대 숙박 인원은 9명(유아 제외) 입니다. 반려동물 동반은 허용되지 않습니다.
              </p>
              <div className={styles.guestFooter}>
                <button type="button" className={styles.guestCloseBtn} onClick={() => setActivePopup(null)}>
                  닫기
                </button>
              </div>
            </div>
          )}
        </div>

        <p className={styles.cancelNotice}>오늘 ₩0 · 9월 13일 전까지 무료 취소 가능</p>

        <button type="button" className={styles.reserveBtn}>
          예약하기
        </button>

        <p className={styles.chargeNotice}>예약 확정 전에는 요금이 청구되지 않습니다.</p>
      </div>
    </>
  );
}
