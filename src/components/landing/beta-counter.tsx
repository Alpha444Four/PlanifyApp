import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import { useI18n } from "@/hooks/use-i18n";



const BETA_KEY = "planify:beta-count";

const BASE = 847;



export function BetaCounter() {

  const { t } = useI18n();

  const [count, setCount] = useState(BASE);



  useEffect(() => {

    const stored = Number(localStorage.getItem(BETA_KEY) ?? BASE);

    setCount(Number.isFinite(stored) ? stored : BASE);

  }, []);



  useEffect(() => {

    const handler = () => {

      setCount((c) => {

        const next = c + 1;

        localStorage.setItem(BETA_KEY, String(next));

        return next;

      });

    };

    window.addEventListener("planify:beta-signup", handler);

    return () => window.removeEventListener("planify:beta-signup", handler);

  }, []);



  return (

    <motion.p

      initial={{ opacity: 0 }}

      animate={{ opacity: 1 }}

      className="mt-6 font-mono text-sm text-primary"

    >

      {t("landing.betaLine", { count: count.toLocaleString() })}

    </motion.p>

  );

}

