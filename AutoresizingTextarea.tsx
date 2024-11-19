import { JSX, onCleanup, onMount } from "solid-js";

export function AutoresizingTextarea(props: Omit<JSX.HTMLAttributes<HTMLTextAreaElement>, "ref">) {
  let textareaRef!: HTMLTextAreaElement;
  let lastContent = '';

  onMount(() => {
    function resize() {
      const currentContent = textareaRef.value;
      if (currentContent === lastContent) return;
      lastContent = currentContent;

      textareaRef.style.height = "0";
      textareaRef.style.height = textareaRef.scrollHeight + "px";
      textareaRef.style.resize = "none";
    }

    resize();

    let animationFrameId: number;

    function startAnimation() {
      void (function animationLoop() {
        resize();
        animationFrameId = requestAnimationFrame(animationLoop);
      })();
    }

    function stopAnimation() {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    }

    textareaRef.addEventListener('focus', startAnimation);
    textareaRef.addEventListener('blur', stopAnimation);

    onCleanup(() => {
      textareaRef.removeEventListener('focus', startAnimation);
      textareaRef.removeEventListener('blur', stopAnimation);
      stopAnimation();
    });
  });

  return <textarea {...props} ref={textareaRef} />;
}
