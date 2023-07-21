<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { blur } from 'svelte/transition';

	let game: App.Game = 'waiting for input';
	let typedLetter = '';

	let words: App.Word[] = 'loremdk dkfdk ekrkedafs cv'.split(' ');

	let wordIndex = 0;
	let letterIndex = 0;
	let correctLetters = 0;
	let seconds = 10;
	let totalLetters = 0;

	let cpm = tweened(0, { delay: 300, duration: 1000 });
	let acc = tweened(0, { delay: 1000, duration: 1000 });

	let inputEl: HTMLInputElement;
	let wordsEl: HTMLDivElement;
	let letterEl: HTMLSpanElement;
	let caretEl: HTMLDivElement;

	function getCPM() {
		const time = 10;
		return Math.floor((correctLetters * 60) / time);
	}

	function getACC() {
		return Math.floor((correctLetters / totalLetters) * 100);
	}

	function getResults() {
		$cpm = getCPM();
		$acc = getACC();
	}

	function startGame() {
		setGameState('in progress');
		setGameTimer();
	}

	function setGameState(state: App.Game) {
		game = state;
	}

	function setGameTimer() {
		function gameTimer() {
			if (seconds > 0) {
				seconds--;
			}

			if (game === 'waiting for input' || seconds === 0) {
				clearInterval(timer);
			}

			if (seconds === 0) {
				setGameState('game over');
				getResults();
				totalLetters = 0;
				correctLetters = 0;
			}
		}

		const timer = setInterval(gameTimer, 1000);
	}

	function updateGameState() {
		console.log('c');
		setLetter();
		checkLetter();
		nextLetter();
		updateLine();
		resetLetter();
		moveCaret();
	}

	function setLetter() {
		const isWordCompleted = letterIndex > words[wordIndex].length - 1;

		if (!isWordCompleted) {
			letterEl = wordsEl.children[wordIndex].children[letterIndex] as HTMLSpanElement;
		}
	}

	function checkLetter() {
		const currentLetter = words[wordIndex][letterIndex];
		if (typedLetter === currentLetter) {
			letterEl.dataset.letter = 'correct';
			increaseScore();
		} else letterEl.dataset.letter = 'incorrect';
	}

	function increaseScore() {
		correctLetters++;
	}

	function nextLetter() {
		letterIndex++;
		totalLetters++;
	}

	function nextWord() {
		const isNotFirstLetter = letterIndex !== 0;
		const isOneletterWord = words[wordIndex].length === 1;

		// 띄어쓰기: 무분별한 띄어쓰기 방지 - 첫글자일 때 넘기기 금지. 단 한글자 단어일 경우엔 패스
		if (isNotFirstLetter || isOneletterWord) {
			wordIndex++;
			totalLetters++;
			letterIndex = 0;
			increaseScore();
			setLetter();
			moveCaret('space');
		}
	}

	function updateLine() {
		const wordEl = wordsEl.children[wordIndex];
		const wordsY = wordsEl.getBoundingClientRect().y;
		const wordY = wordEl.getBoundingClientRect().y;

		if (wordY > wordsY) {
			wordEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
		}
	}

	function resetLetter() {
		typedLetter = '';
	}

	function moveCaret(space?: string) {
		if (!letterEl || !caretEl) return;
		const { offsetLeft, offsetTop, offsetWidth } = letterEl;
		const spaceWidth = 12;

		if (space) {
			caretEl.animate(
				[
					{ top: `${offsetTop}px`, left: `${offsetLeft - spaceWidth}px` },
					{
						top: `${offsetTop}px`,
						left: `${offsetLeft}px`
					}
				],
				{ duration: 200, fill: 'forwards' }
			);
		} else
			caretEl.animate(
				[
					{ top: `${offsetTop}px`, left: `${offsetLeft}px` },
					{
						top: `${offsetTop}px`,
						left: `${offsetLeft + offsetWidth}px`
					}
				],
				{ duration: 200, fill: 'forwards' }
			);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.code === 'Space') {
			e.preventDefault();
			if (game === 'in progress') {
				nextWord();
			}
		}

		if (game === 'waiting for input') {
			startGame();
		}
	}
</script>

{#if game !== 'game over'}
	<div class="game" data-game={game}>
		<input
			bind:this={inputEl}
			bind:value={typedLetter}
			on:input={updateGameState}
			on:keydown={handleKeydown}
			class="input"
			type="text"
		/>

		<div class="time">{seconds}</div>

		<div bind:this={wordsEl} class="words">
			{#each words as word}
				<span class="word">
					{#each word as letter}
						<span class="letter">{letter}</span>
					{/each}
				</span>
			{/each}
			<div bind:this={caretEl} class="caret" />
		</div>
	</div>
{:else if game === 'game over'}
	<div class="results">
		<div>
			<p class="title">cpm</p>
			<p class="score">{Math.trunc($cpm)}</p>
		</div>
		<div>
			<p class="title">acc</p>
			<p class="score">{Math.trunc($acc)}</p>
		</div>
	</div>
{/if}

<style lang="postcss">
	.game {
		position: relative;

		.time {
			position: absolute;
			top: -48px;
			font-size: 1.5rem;
			color: var(--primary);
			opacity: 0;
			transition: opacity 0.3s ease-in-out;
		}

		&[data-game='in progress'] .time {
			opacity: 1;
		}
	}

	.words {
		--line-height: 1em;
		--lines: 3;
		width: 100%;
		max-height: calc(var(--line-height) * var(--lines) * 1.42);
		display: flex;
		flex-wrap: wrap;
		gap: 0.6em;
		position: relative;
		font-size: 1.5rem;
		line-height: var(--line-height);
		overflow: hidden;
		user-select: none;

		.letter {
			opacity: 0.4;
			transition: opacity 0.3s ease-in-out;
		}

		:global([data-letter='correct']) {
			opacity: 0.8;
		}
		:global([data-letter='incorrect']) {
			opacity: 1;
			color: var(--primary);
		}

		.caret {
			position: absolute;
			height: 1.8rem;
			top: 0;
			border-right: 1px solid var(--primary);
		}
	}

	.results {
		.title {
			font-size: 2rem;
			color: var(--fg-200);
		}
		.score {
			font-size: 4rem;
			color: var(--primary);
		}
		.play {
			margin-top: 1rem;
		}
	}
</style>
