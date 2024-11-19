import { createEffect, createSignal, JSX, onCleanup, onMount } from "solid-js";

export function AutoresizingTextarea(props: Omit<JSX.HTMLAttributes<HTMLTextAreaElement>, "ref">) {
  let textareaRef!: HTMLTextAreaElement;

  let lastContent = '';
  function resize() {
    const currentContent = textareaRef.value;
    if (currentContent === lastContent) return;
    lastContent = currentContent;

    textareaRef.style.height = "0";
    textareaRef.style.height = textareaRef.scrollHeight + "px";
    textareaRef.style.resize = "none";
  }

  onMount(() => {
    resize();
    createFocusEffect(textareaRef, (isFocused) => {
      if (isFocused) {
        createAnimationFrameListener(resize);
      }
    });
  });


  return <textarea {...props} ref={textareaRef} />;
}


function createFocusEffect(element: HTMLTextAreaElement, effect: (isFocused: boolean) => void) {
  const [isFocused, setIsFocused] = createSignal(false);

  onMount(() => {
    element.addEventListener('focus', () => setIsFocused(true));
    element.addEventListener('blur', () => setIsFocused(false));
  });

  createEffect(() => {
    effect(isFocused());
  });
}


function createAnimationFrameListener(effect: () => void) {
  let animationFrameId: number;

  void (function animationLoop() {
    effect();
    animationFrameId = requestAnimationFrame(animationLoop);
  })();

  onCleanup(() => {
    cancelAnimationFrame(animationFrameId);
  });
}
