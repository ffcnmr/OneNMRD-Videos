NAME = "onenmrd-introduction"
TITLE = "OneNMRD Interface introduction"
IMAGES = {
    "endcard": "../../kit/end-card.png",
    "title": "slides/title.png", "consoles": "slides/consoles.png", "seqs": "slides/seqs.png", "close": "slides/close.png",
    "ur8": "shots/10-ultrarelax8.png", "sequences": "shots/20-sequences.png", "live": "shots/30-live.png",
    "noise": "shots/35-noise.png", "results": "shots/40-results.png", "terminal": "shots/50-terminal.png",
    "ofegui": "shots/60-ofe-gui.png",
}

# Each sentence: caption text, spoken text (pronunciation fixes), optional
# length_scale, and the shot: image, camera (x, y, width in source px; height
# follows 16:9) and an optional highlight: a box (x0, y0, x1, y1), a list of
# boxes, or slide element names ("slide:name") from slides/boxes.json.
FULL = (0, 0, 3840)
GUI_ALL = (0, 0, 3840)

SECTIONS = [
  {"title": "OneNMRD Interface", "label": None, "sentences": [
    ("OneNMRD Interface controls NMR relaxometry experiments and analyses their NMRD profiles.",
     "One N M R D Interface controls N M R relaxometry experiments, and analyses their N M R D profiles.", None, "title", FULL, None),
    ("It works with conventional and fast-field-cycling consoles, in your web browser.",
     "It works with conventional and fast field cycling consoles, in your web browser.", None, "title", (120, 70, 3600), None),
    ("Everything in this tour comes from its built-in simulator: no hardware is moved.",
     None, None, "title", (200, 120, 3440), None),
  ]},
  {"title": "Consoles and magnets", "label": None, "sentences": [
    ("One interface drives different consoles and magnets.",
     None, None, "consoles", FULL, None),
    ("FFC4, the fast-field-cycling relaxometer at IST, runs on a Magritek Kea console with Prospa.",
     "F F C four, the fast field cycling relaxometer at I S T, runs on a Magritek Kea console, with Prospa.", None, "consoles", FULL, "consoles:ffc4"),
    ("The Resonance Systems ultraRelax8 runs through uSpin32, with generated run scripts and its exported scans.",
     "The Resonance Systems ultra relax eight runs through you spin thirty-two, with generated run scripts, and its exported scans.", None, "consoles", FULL, "consoles:ur8"),
    ("The simulator stands in for either console, for training and testing.",
     None, None, "consoles", FULL, "consoles:sim"),
  ]},
  {"title": "ultraRelax8", "label": "OneNMRD · ultraRelax8", "sentences": [
    ("Each console is chosen at the top, with its own settings and hardware.",
     None, None, "ur8", (0, 0, 1900), (300, 14, 680, 82)),
    ("On the ultraRelax8, the field-cycling device levels, V1 and V2, come from the field calibration, within the firmware limits.",
     "On the ultra relax eight, the field cycling device levels, V one and V two, come from the field calibration, within the firmware limits.", None, "ur8", (0, 180, 1950), (70, 260, 1850, 910)),
  ]},
  {"title": "Pulse sequences", "label": None, "sentences": [
    ("The sequences are field-cycling and standard ones.",
     None, None, "seqs", FULL, None),
    ("Eight field-cycling sequences: polarised at high field or starting from a low field, with inversion or saturation, each also with a solid echo.",
     None, None, "seqs", FULL, "seqs:ffc"),
    ("Inversion recovery and saturation recovery are the standard T1 sequences, at fixed field, on the ultraRelax8.",
     "Inversion recovery and saturation recovery are the standard T one sequences, at fixed field, on the ultra relax eight.", None, "seqs", FULL, "seqs:fixed"),
    ("RF tuning, and a Tune of any sequence, come before the run.",
     "R F tuning, and a Tune of any sequence, come before the run.", None, "seqs", FULL, "seqs:tune"),
  ]},
  {"title": "Sequences and plan", "label": "OneNMRD · Sequences", "sentences": [
    ("Each timing diagram is drawn from the sequence's own pulse program, with the current parameters.",
     None, None, "sequences", (0, 180, 2400), (40, 500, 2330, 1240)),
    ("It shows the field switching, the RF pulses and the acquisition; every segment opens the parameter behind it.",
     "It shows the field switching, the R F pulses, and the acquisition; every segment opens the parameter behind it.", None, "sequences", (0, 380, 2400), (290, 600, 2330, 1240)),
    ("The plan lists temperature, field, sequence, scans and τ values for each row, and estimates the run time.",
     "The plan lists temperature, field, sequence, scans, and tau values for each row, and estimates the run time.", None, "sequences", (0, 800, 2400), (30, 1360, 2340, 1840)),
    ("Settings records which sequences the hardware has.",
     None, None, "sequences", (2300, 700, 1540), (2450, 900, 3770, 1480)),
  ]},
  {"title": "Live acquisition", "label": "OneNMRD · Live acquisition", "sentences": [
    ("Run plan starts the experiment, one row after another.",
     None, None, "live", GUI_ALL, (2330, 580, 3810, 670)),
    ("Live acquisition shows every scan as it arrives, with its spectrum.",
     None, None, "live", (0, 180, 2300), (590, 350, 2270, 920)),
    ("M is taken in the Mz window, with its σ, the noise, and the signal-to-noise ratio.",
     "M is taken in the M z window, with its sigma, the noise, and the signal to noise ratio.", None, "live", (0, 180, 2300), (30, 290, 570, 850)),
    ("The average gets quieter as the scans add up.",
     None, None, "live", (0, 600, 2300), (590, 940, 1400, 1520)),
    ("M(τ) of the current field builds up, point by point.",
     "M of tau, of the current field, builds up, point by point.", None, "live", (0, 840, 2300), (590, 1540, 1400, 2110)),
    ("When a field is complete, it is fitted at once, with one, two or three exponentials, in milliseconds.",
     None, None, "live", (0, 840, 2300), (1430, 1540, 2270, 2110)),
    ("Meanwhile, Results follows the run: each finished field can be looked at while the next one is measured.",
     None, None, "live", (1600, 800, 2240), (2320, 930, 3820, 2040)),
  ]},
  {"title": "Noise", "label": "OneNMRD · Noise", "sentences": [
    ("The noise analysis is your choice.",
     None, None, "noise", GUI_ALL, None),
    ("The phase treatment can be phase independent, two-phase or four-phase, with the noise from the scatter between scans.",
     None, None, "noise", (2140, 200, 1700), (2280, 480, 3780, 620)),
    ("The previous Prospa analysis stays available, for comparison.",
     None, None, "noise", (2140, 200, 1700), (3180, 550, 3790, 620)),
    ("A Gaussian filter can be previewed on the last scan before it is saved: here 20 kHz, with the filtered and unfiltered averages side by side.",
     "A Gaussian filter can be previewed on the last scan, before it is saved: here, twenty kilohertz, with the filtered and unfiltered averages side by side.", None, "noise", (0, 180, 2300), [(30, 1224, 560, 1480), (590, 940, 1380, 1520)]),
    ("On the ultraRelax8, a short noise and health check is compared with the machine's reference, value by value, and kept as a trend.",
     "On the ultra relax eight, a short noise and health check is compared with the machine's reference, value by value, and kept as a trend.", None, "ur8", (1900, 180, 1940), (1970, 560, 3790, 1160)),
  ]},
  {"title": "Fit in OFE", "label": "OneNMRD · Results", "sentences": [
    ("The final analysis is OneFit Engine's.",
     "The final analysis is One Fit Engine's.", None, "results", (0, 180, 2400), None),
    ("Fit in OFE fits every field with OFE-Go, with MINOS errors and reduced chi-square: here, four fields in about two seconds.",
     "Fit in O F E fits every field with O F E Go, with minos errors and reduced chi-square: here, four fields in about two seconds.", None, "results", (0, 180, 2400), [(996, 280, 1180, 336), (30, 430, 2340, 690)]),
    ("The T1 dispersion is plotted, together with the T1 that Prospa wrote, for comparison.",
     "The T one dispersion is plotted, together with the T one that Prospa wrote, for comparison.", None, "results", (0, 380, 2400), (1200, 730, 2330, 1510)),
    ("The models are full OFE expressions, and can be edited.",
     "The models are full O F E expressions, and can be edited.", None, "results", (0, 180, 2400), (712, 284, 776, 332)),
  ]},
  {"title": "OFE-GUI", "label": "OFE-GUI", "sentences": [
    ("Open in OFE-GUI sends the fit to a running OFE-GUI.",
     "Open in O F E GUI sends the fit to a running O F E GUI.", None, "ofegui", GUI_ALL, (15, 603, 1400, 663)),
    ("It refits it and plots every field, to change the model, the bounds or the plots there.",
     None, None, "ofegui", (1450, 810, 2390), (1557, 1468, 3710, 2079)),
  ]},
  {"title": "Terminal and AI agents", "label": "OneNMRD · Terminal", "sentences": [
    ("The Terminal pane is a real shell on the computer running OneNMRD, inside the page. It is off by default.",
     "The Terminal pane is a real shell on the computer running One N M R D, inside the page. It is off by default.", None, "terminal", (2180, 180, 1660), None),
    ("Its Claude and Codex buttons start a separately installed coding agent there, in a Docker sandbox when one is available.",
     None, None, "terminal", (2180, 180, 1660), (2880, 275, 3160, 340)),
    ("OneNMRD writes an AGENTS file for them: how to reach the GUI, the hardware rules, and the JSON API.",
     "One N M R D writes an agents file for them: how to reach the GUI, the hardware rules, and the jay-son A P I.", None, "terminal", (2180, 180, 1660), (2230, 360, 3200, 480)),
    ("Here the API lists the run and its four fields.",
     "Here, the A P I lists the run, and its four fields.", None, "terminal", (2180, 180, 1660), (2230, 480, 3800, 730)),
    ("A Tune or a Run asked for by an agent waits for your Approve; Stop is always allowed.",
     None, None, "terminal", (2180, 180, 1660), None),
  ]},
  {"title": "OneNMRD Interface", "label": None, "sentences": [
    ("Plan, acquire, watch, and fit.",
     None, 1.2, "close", FULL, None),
    ("OneNMRD Interface drives FFC4 and the ultraRelax8, and hands the analysis to OneFit Engine.",
     "One N M R D Interface drives F F C four and the ultra relax eight, and hands the analysis to One Fit Engine.", None, "close", FULL, None),
    ("It is distributed under the Artistic License 2.0. Prospa and uSpin32 are separate products, and are not included.",
     "It is distributed under the Artistic License two point zero. Prospa and you spin thirty-two are separate products, and are not included.", None, "close", FULL, None),
  ]},
]

# the dark social-preview banner, silent, after the last words
END_CARD = ("endcard", 4.0)
