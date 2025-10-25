import "../styles/globals.css";
import "react-quill/dist/quill.snow.css";
import Layout from "../components/Layout";
import Preloader from "../components/Preloader";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Paper flip animation variants
  const pageVariants = {
    initial: {
      rotateY: -90,
      opacity: 0,
      transformOrigin: "left center",
    },
    animate: {
      rotateY: 0,
      opacity: 1,
      transformOrigin: "left center",
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    exit: {
      rotateY: 90,
      opacity: 0,
      transformOrigin: "right center",
      transition: {
        duration: 0.6,
        ease: "easeIn",
      },
    },
  };

  return (
    <>
      <Preloader />
      <Layout>
        <AnimatePresence mode="wait">
          <motion.div
            key={router.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            style={{ perspective: "1200px" }}
          >
            <Component {...pageProps} />
          </motion.div>
        </AnimatePresence>
      </Layout>
    </>
  );
}
