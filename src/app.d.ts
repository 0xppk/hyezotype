// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
		type Game = 'waiting for input' | 'in progress' | 'game over';
		type Word = string;
	}
}

export {};
