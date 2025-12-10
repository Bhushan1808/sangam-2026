

        function animate() {

			const container = document.getElementById('visual-container');

			const lightThemeOptions = {
				onSpeedUp: (ev) => {					
				},
				onSlowDown: (ev) => {
				},
				// mountainDistortion || LongRaceDistortion || xyDistortion || turbulentDistortion || turbulentDistortionStill || deepDistortionStill || deepDistortion
				distortion: xyDistortion, 
				
				length: 400,
				roadWidth: 9,
				islandWidth: 2,
				lanesPerRoad: 2,

				fov: 90,
				fovSpeedUp: 150,
				speedUp: 3,
				carLightsFade: 0.4,

				totalSideLightSticks: 50,
				lightPairsPerRoadWay: 30,

				// Percentage of the lane's width
				shoulderLinesWidthPercentage: 0.05,
				brokenLinesWidthPercentage: 0.1,
				brokenLinesLengthPercentage: 0.5,

				/*** These ones have to be arrays of [min,max].  ***/
				lightStickWidth: [0.5, 2],
				lightStickHeight: [0.7, 2],

				movingAwaySpeed: [20, 50],
				movingCloserSpeed: [-150, -230],

				/****  Anything below can be either a number or an array of [min,max] ****/

				// Length of the lights. Best to be less than total length
				carLightsLength: [800 * 0.05, 800 * 0.2],
				// Radius of the tubes
				carLightsRadius: [0.03, 0.1],
				// Width is percentage of a lane. Numbers from 0 to 1
				carWidthPercentage: [0.1, 0.9],
				// How drunk the driver is.
				// carWidthPercentage's max + carShiftX's max -> Cannot go over 1. 
				// Or cars start going into other lanes 
				carShiftX: [-0.5, 0.5],
				// Self Explanatory
				carFloorSeparation: [0, 0.1],

				colors: {
					roadColor: 0x080808,
					islandColor: 0x0a0a0a,
					background: 0xffffff,
					shoulderLines: 0x131318,
					brokenLines: 0x131318,
					/***  Only these colors can be an array ***/
					leftCars: [0x7D0D1B, 0xA90519, 0xff102a],
					rightCars: [0x7D0D1B, 0xA90519, 0xff102a],
					sticks: 0xF1EECE,
				}
			};

			const darkThemeOptions =  {
				onSpeedUp: (ev) => {					
				},
				onSlowDown: (ev) => {
				},
				// mountainDistortion || LongRaceDistortion || xyDistortion || turbulentDistortion || turbulentDistortionStill || deepDistortionStill || deepDistortion
				distortion: xyDistortion, 
				
				length: 400,
				roadWidth: 9,
				islandWidth: 2,
				lanesPerRoad: 2,

				fov: 90,
				fovSpeedUp: 150,
				speedUp: 3,
				carLightsFade: 0.4,

				totalSideLightSticks: 50,
				lightPairsPerRoadWay: 30,

				// Percentage of the lane's width
				shoulderLinesWidthPercentage: 0.05,
				brokenLinesWidthPercentage: 0.1,
				brokenLinesLengthPercentage: 0.5,

				/*** These ones have to be arrays of [min,max].  ***/
				lightStickWidth: [0.02, 0.05],
				lightStickHeight: [0.3, 0.7],

				movingAwaySpeed: [20, 50],
				movingCloserSpeed: [-150, -230],

				/****  Anything below can be either a number or an array of [min,max] ****/

				// Length of the lights. Best to be less than total length
				carLightsLength: [400 * 0.05, 400 * 0.2],
				// Radius of the tubes
				carLightsRadius: [0.03, 0.08],
				// Width is percentage of a lane. Numbers from 0 to 1
				carWidthPercentage: [0.1, 0.5],
				// How drunk the driver is.
				// carWidthPercentage's max + carShiftX's max -> Cannot go over 1. 
				// Or cars start going into other lanes 
				carShiftX: [-0.5, 0.5],
				// Self Explanatory
				carFloorSeparation: [0, 0.1],

				colors: {
					roadColor: 0x080808,
					islandColor: 0x0a0a0a,
					background: 0x000000,
					shoulderLines: 0x131318,
					brokenLines: 0x131318,
					/***  Only these colors can be an array ***/
					leftCars: [0x7D0D1B, 0xA90519, 0xff102a],
					rightCars: [0xF1EECE, 0xE6E2B1, 0xDFD98A],
					sticks: 0xF1EECE,
				}
			};;

			// Choose options based on selected theme.
			// Prefer a persisted choice in localStorage ('site-theme'), then the `data-theme` attribute,
			// then fall back to OS preference.
			function readSavedTheme() {
				try {
					const stored = localStorage.getItem('site-theme');
					if (stored) return stored;
				} catch (e) {
					// ignore storage errors
				}
				const attr = document.documentElement.getAttribute('data-theme');
				if (attr) return attr;
				return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
			}
			const selectedTheme = readSavedTheme();
			const options = (selectedTheme === 'dark') ? darkThemeOptions : lightThemeOptions;

			const myApp = new App(container, options);
			myApp.loadAssets().then(myApp.init)
		}

animate();