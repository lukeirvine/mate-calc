# 🧉 Mate Calc

**Caffeine in every sip.** Mate Calc estimates how much caffeine is in your yerba mate, based on how you brew it.

## ✨ What it does

Pick your brew, set your parameters, and get an instant caffeine estimate:

- 🍃 **Brew method**: Gourd, French Press, Tea Bag, Tereré, or Cocido
- ⚖️ **Yerba amount**: 5–150 g
- 🔁 **Refills**: gourd only, since each refill pulls out a bit less caffeine
- 🌡️ **Water temperature**: Hot, Warm, or Cold (°C or °F)

You get:

- 📊 Estimated caffeine in **mg**, with an intensity rating from *Light Buzz* to *Very Strong*
- ☕ The equivalent in cups of coffee (at 95 mg each)
- 🚦 The share of the 400 mg daily guideline it uses up

It also has 🌙 light and dark themes and works on 📱 mobile.

## 🧪 How it works

The calculator assumes about **12 mg of caffeine per gram** of dry yerba. It multiplies that by an extraction rate for the brew method and a factor for the water temperature. For a gourd, extraction builds up with each refill, and each refill adds less than the one before it, up to a maximum of 90%.

The algorithm is based on [Botanica Andina's analysis of 47 studies](https://dev.to/botanica_andina/yerba-mate-caffeine-i-analyzed-47-studies-to-build-a-calculator-that-actually-works-2601).

> ⚠️ These are estimates. Caffeine content varies by brand, cut, and how you prepare your mate. This isn't medical advice.

## 🛠️ Tech stack

[Next.js](https://nextjs.org) · React · TypeScript · Tailwind CSS · [daisyUI](https://daisyui.com)

## 🚀 Run locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).
