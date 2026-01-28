import { useEffect } from "react";

import { useTaskInfoStore } from "@/zustand/taskInfoStore";

export const useHotkeyInfoBlock = (enabled: boolean = true) => {
	const { toggle: toggleInfoBlock } = useTaskInfoStore();
	useEffect(() => {
		if (!enabled) return;

		const keyUp = (e: KeyboardEvent) => {
			if (e.key === "`") toggleInfoBlock();
		};

		window.addEventListener("keyup", keyUp);
		return () => window.removeEventListener("keyup", keyUp);
	}, [enabled]);
};
