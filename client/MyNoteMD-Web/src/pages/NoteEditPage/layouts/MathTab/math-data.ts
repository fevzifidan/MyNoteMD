export const MATH_SYMBOLS = {
  Basics: ["+", "-", "\\pm", "\\times", "\\div", "=", "\\neq", "\\equiv",
    "<", ">", "\\le", "\\ge", "\\approx", "\\sim", "\\propto",
    "\\sqrt{x}", "\\sqrt[n]{x}", "\\sum", "\\int", "\\frac{a}{b}",
    "x^n", "x_n", "x \\bmod n", "x \\pmod{n}", "\\%", "\\overline{x}",
    "\\underline{x}", "\\widehat{x}", "\\widetilde{x}",
    "\\overrightarrow{x}", "\\overleftarrow{x}", "\\overbrace{x}",
    "\\underbrace{x}", "\\pi"],
  
  Letters: ["\\alpha", "\\beta", "\\gamma", "\\delta", "\\epsilon",
    "\\varepsilon", "\\zeta", "\\eta", "\\theta", "\\vartheta",
    "\\iota", "\\kappa", "\\varkappa", "\\lambda", "\\mu",
    "\\nu", "\\xi", "\\pi", "\\varpi", "\\rho",
    "\\varrho", "\\sigma", "\\varsigma", "\\tau", "\\upsilon",
    "\\phi", "\\varphi", "\\chi", "\\psi", "\\omega",
    // Capital Letters
    "\\Gamma", "\\Delta", "\\Theta", "\\Lambda", "\\Xi",
    "\\Pi", "\\Sigma", "\\Upsilon", "\\Phi", "\\Psi",
    "\\Omega"],

  Arrows: ["\\leftarrow", "\\Leftarrow", "\\rightarrow", "\\Rightarrow",
    "\\leftrightarrow", "\\Leftrightarrow", "\\uparrow", "\\Uparrow",
    "\\downarrow", "\\Downarrow", "\\updownarrow", "\\Updownarrow",
    
    // Long Arrows
    "\\longleftarrow", "\\Longleftarrow", "\\longrightarrow", "\\Longrightarrow",
    "\\longleftrightarrow", "\\Longleftrightarrow", "\\longmapsto", "\\longmapsto",
    
    // Harpoon and Special Arrows
    "\\mapsto", "\\hookleftarrow", "\\hookrightarrow", "\\leftharpoonup",
    "\\leftharpoondown", "\\rightharpoonup", "\\rightharpoondown", "\\rightleftharpoons",
    "\\leftrightharpoons", "\\leadsto", "\\rightsquigarrow", "\\leftrightsquigarrow",
    "\\implies", "\\iff",
    
    // Directional Arrows
    "\\nearrow", "\\searrow", "\\swarrow", "\\nwarrow",
    
    // AMS and Advanced Arrows
    "\\dashleftarrow", "\\dashrightarrow", "\\leftleftarrows", "\\rightrightarrows",
    "\\leftrightarrows", "\\rightleftarrows", "\\Lleftarrow", "\\Rsh",
    "\\Lsh", "\\twoheadleftarrow", "\\twoheadrightarrow", "\\leftarrowtail",
    "\\rightarrowtail", "\\looparrowleft", "\\looparrowright", "\\curvearrowleft",
    "\\curvearrowright", "\\circlearrowleft", "\\circlearrowright", "\\upuparrows",
    "\\downdownarrows", "\\upharpoonleft", "\\upharpoonright", "\\downharpoonleft",
    "\\downharpoonright", "\\multimap", "\\leftrightsquigarrow",
    
    "\\rightsquigarrow",
    
    // Negated Arrows
    "\\nleftarrow", "\\nLeftarrow", "\\nrightarrow", "\\nRightarrow",
    "\\nleftrightarrow", "\\nLeftrightarrow",],

  Accents: [
    // Single Accents
    "\\acute{a}", "\\bar{a}", "\\breve{a}", "\\check{a}", "\\ddot{a}",
    "\\dot{a}", "\\grave{a}", "\\hat{a}", "\\tilde{a}", "\\vec{a}",
    
    // Double Accents
    "\\acute{\\acute{A}}", "\\bar{\\bar{A}}", "\\breve{\\breve{A}}",
    "\\check{\\check{A}}", "\\ddot{A}", "\\dot{\\dot{A}}", "\\grave{\\grave{A}}",
    "\\hat{\\hat{A}}", "\\tilde{\\tilde{A}}", "\\vec{\\vec{A}}"
  ],

  Functions: ["\\arccos", "\\arcsin", "\\arctan", "\\arg", "\\cos",
    "\\cosh", "\\cot", "\\coth", "\\csc", "\\deg",
    "\\det", "\\dim", "\\exp", "\\gcd", "\\hom",
    "\\inf", "\\ker", "\\lg", "\\lim", "\\liminf",
    "\\limsup", "\\ln", "\\log", "\\max", "\\min",
    "\\Pr", "\\sec", "\\sin", "\\sinh", "\\sup",
    "\\tan", "\\tanh"
  ],

  "Binary Operation/Relation Symbols": ["\\ast", "\\star", "\\cdot", "\\circ", "\\bullet", "\\bigcirc",
    "\\diamond", "\\times", "\\div", "\\centerdot", "\\circledast", "\\circledcirc",
    "\\circleddash", "\\dotplus", "\\divideontimes", "\\pm", "\\mp", "\\amalg",
    "\\odot", "\\ominus", "\\oplus", "\\oslash", "\\otimes", "\\wr",
    "\\Box", "\\boxplus", "\\boxminus", "\\boxtimes", "\\boxdot", "\\square",
    "\\cap", "\\cup", "\\uplus", "\\sqcap", "\\sqcup", "\\wedge",
    "\\vee", "\\dagger", "\\ddagger", "\\barwedge", "\\curlywedge", "\\Cap",
    "\\bot", "\\intercal", "\\doublebarwedge", "\\lhd", "\\rhd", "\\triangleleft",
    "\\triangleright", "\\unlhd", "\\unrhd", "\\bigtriangledown", "\\bigtriangleup", "\\setminus",
    "\\veebar", "\\curlyvee", "\\Cup", "\\top", "\\rightthreetimes", "\\leftthreetimes",

    "\\equiv", "\\cong", "\\neq", "\\sim", "\\simeq", "\\approx", "\\asymp", "\\doteq", "\\propto", "\\models",
    "\\leq", "\\prec", "\\preceq", "\\ll", "\\subset", "\\subseteq", "\\sqsubset", "\\sqsubseteq", "\\dashv", "\\in",
    "\\geq", "\\succ", "\\succeq", "\\gg", "\\supset", "\\supseteq", "\\sqsupset", "\\sqsupseteq", "\\vdash", "\\ni",
    "\\perp", "\\mid", "\\parallel", "\\bowtie", "\\Join", "\\ltimes", "\\rtimes", "\\smile", "\\frown", "\\notin",

    "\\approxeq", "\\thicksim", "\\backsim", "\\backsimeq", "\\triangleq", "\\circeq", "\\bumpeq", "\\Bumpeq",
    "\\doteqdot", "\\thickapprox", "\\fallingdotseq", "\\risingdotseq", "\\varpropto", "\\therefore", "\\because",
    "\\eqcirc", "\\neq", "\\leqq", "\\leqslant", "\\lessapprox", "\\lll", "\\lessdot", "\\lesssim", "\\eqslantless",
    "\\precsim", "\\precapprox", "\\Subset", "\\subseteqq", "\\sqsubset", "\\preccurlyeq", "\\curlyeqprec",
    "\\blacktriangleleft", "\\trianglelefteq", "\\vartriangleleft", "\\geqq", "\\geqslant", "\\gtrapprox", "\\ggg",
    "\\gtrdot", "\\gtrsim", "\\eqslantgtr", "\\succsim", "\\succapprox", "\\Supset", "\\supseteqq", "\\sqsupset",
    "\\succcurlyeq", "\\curlyeqsucc", "\\blacktriangleright", "\\trianglerighteq", "\\vartriangleright", "\\lessgtr",
    "\\lesseqgtr", "\\lesseqqgtr", "\\gtreqless", "\\gtreqqless", "\\gtrless", "\\backepsilon", "\\between", "\\pitchfork",
    "\\shortmid", "\\smallfrown", "\\smallsmile", "\\Vdash", "\\vDash", "\\Vvdash", "\\shortparallel", "\\nshortparallel",

    "\\ncong", "\\nmid", "\\nparallel", "\\nshortmid", "\\nshortparallel", "\\nsim", "\\nVDash", "\\nvDash", "\\nvdash",
    "\\ntriangleleft", "\\ntrianglelefteq", "\\ntriangleright", "\\ntrianglerighteq", "\\nleq", "\\nleqq", "\\nleqslant",
    "\\nless", "\\nprec", "\\npreceq", "\\precnapprox", "\\precnsim", "\\lnapprox", "\\lneq", "\\lneqq", "\\lnsim", "\\lvertneqq",
    "\\ngeq", "\\ngeqq", "\\ngeqslant", "\\ngtr", "\\nsucc", "\\nsucceq", "\\succnapprox", "\\succnsim", "\\gnapprox", "\\gneq",
    "\\gneqq", "\\gnsim", "\\gvertneqq", "\\nsubseteq", "\\nsupseteq", "\\nsubseteqq", "\\nsupseteqq", "\\subsetneq", "\\supsetneq",
    "\\subsetneqq", "\\supsetneqq", "\\varsubsetneq", "\\varsupsetneq", "\\varsubsetneqq", "\\varsupsetneqq"
  ],

  Miscallaneous: ["\\infty", "\\nabla", "\\partial", "\\eth", "\\clubsuit", "\\diamondsuit", "\\heartsuit",
    "\\spadesuit", "\\cdots", "\\vdots", "\\ldots", "\\ddots", "\\Im", "\\Re",
    "\\forall", "\\exists", "\\nexists", "\\emptyset", "\\varnothing", "\\imath", "\\jmath",
    "\\ell", "\\int\\!\\int\\!\\int\\!\\int", "\\iiint", "\\iint", "\\oint", "\\sharp", "\\flat", "\\natural",
    "\\Bbbk", "\\bigstar", "\\diagdown", "\\diagup", "\\Diamond", "\\Finv", "\\Game",
    "\\hbar", "\\hslash", "\\lozenge", "\\mho", "\\prime", "\\square", "\\surd",
    "\\wp", "\\angle", "\\measuredangle", "\\sphericalangle", "\\complement", "\\triangledown", "\\triangle",
    "\\vartriangle", "\\blacklozenge", "\\blacksquare", "\\blacktriangle", "\\blacktriangledown", "\\backprime", "\\circledS"
  ],

  "Variable Sized Symbols": ["\\sum", "\\prod", "\\coprod", "\\int", "\\oint",
    "\\iint", "\\biguplus", "\\bigcap", "\\bigcup", "\\bigoplus",
    "\\bigotimes", "\\bigodot", "\\bigvee", "\\bigwedge", "\\bigsqcup",
  ],

  "LDI": [
    "\\lim", "\\to", "\\infty", "+", "-", "\\sup", "\\inf", "\\limsup", "\\liminf",
    "\\frac{d}{dx}", "\\frac{dy}{dx}", "\\partial", "\\nabla", "\\prime", "\\dot{x}", "\\ddot{x}", "\\Delta", "\\delta",
    "\\int", "\\iint", "\\iiint", "\\oint", "\\int\\limits_{a}^{b}", "\\int\\nolimits_{a}^{b}", "\\oint",
  ],

  "Matrix": ["\\bar{a}", "\\vec{a}", "\\hat{a}", "\\tilde{a}", "\\dot{a}", "\\ddot{a}"],
  "Statistics": [
    "\\mu", "\\bar{x}", "\\bar{y}", "\\tilde{x}", "\\sigma", "\\sigma^2", "\\text{Var}", "\\text{Cov}", "\\text{Corr}", "\\rho", "\\sum",
    "\\text{P}", "\\mathbb{P}", "\\text{E}", "\\text{Var}", "\\text{sd}", "\\mid", "\\Omega", "\\emptyset", "\\cap", "\\cup",
    "\\lambda", "\\theta", "\\pi", "\\alpha", "\\beta", "\\gamma", "\\chi^2", "\\mathcal{N}", "\\text{Bin}", "\\text{Poi}", "\\text{exp}",
    "\\text{H}_0", "\\text{H}_1", "\\text{H}_a", "\\alpha", "\\text{p-value}", "\\text{z}", "\\text{t}", "\\text{F}", "\\nu", "\\text{df}",
    "\\binom{n}{k}", "\\text{C}_n^k", "\\text{P}_n^k", "n!",
    "\\hat{y}", "\\hat{\\beta}", "\\hat{\\theta}", "\\epsilon", "\\varepsilon", "\\text{R}^2", "\\text{MSE}", "\\text{RMSE}",
    "\\infty", "\\propto", "\\sim", "\\approx", "\\int", "\\prod", "\\Delta",
  ],

  "Fourier": [
    "\\mathcal{F}", "\\mathscr{F}", "\\hat", "\\tilde", "\\bar", "\\ast", "\\leftrightarrow", "\\rightleftharpoons",
    "\\omega", "\\Omega", "\\pi", "\\xi", "\\nu", "\\tau", "\\Delta t", "\\Delta f",
    "\\exp", "\\text{e}", "\\text{i}", "\\text{j}", "\\Re", "\\Im", "\\angle", "\\arg", "\\bar{z}",
    "\\operatorname{sinc}", "\\operatorname{rect}", "\\operatorname{tri}", "\\delta", "\\delta(t)", "\\text{sgn}",
    "\\sum", "\\sum_{n=-\\infty}^{\\infty}", "\\int", "\\int_{-\\infty}^{\\infty}", "\\oint", "\\infty",
    "\\sin", "\\cos", "\\mathbf{W}", "\\zeta", "\\text{DFT}", "\\text{IDFT}",
    "\\langle", "\\rangle", "\\left(", "\\right)", "\\vert", "\\Vert",
  ],
};