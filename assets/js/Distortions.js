
/**

    Here on top you can find the uniforms for each distortion. 

    // ShaderShaping funcitns
    https://thebookofshaders.com/05/
     Steps 
     1. Write getDistortion in GLSL
     2. Write custom uniforms for tweak parameters. Put them outside the object.
     3. Re-create the GLSl funcion in javascript to get camera paning

     Notes: 
     LookAtAmp AND lookAtOffset are hand tuned to get a good camera panning.
 */

const xyUniforms = {
  // x,y
  uFreq: new THREE.Uniform(new THREE.Vector2(5, 2)),
  uAmp: new THREE.Uniform(new THREE.Vector2(25, 15))
};


 let xyDistortion = {
  uniforms: xyUniforms,
  getDistortion: `
    uniform vec2 uFreq;
    uniform vec2 uAmp;
	
				#define PI 3.14159265358979

				
				vec3 getDistortion(float progress){

						float movementProgressFix = 0.02;
						return vec3( 
							cos(progress * PI * uFreq.x + uTime) * uAmp.x - cos(movementProgressFix * PI * uFreq.x + uTime) *uAmp.x,
							sin(progress * PI * uFreq.y + PI/2. + uTime) * uAmp.y - sin(movementProgressFix * PI * uFreq.y + PI/2. + uTime) * uAmp.y,
							0.
						);
					}
			`,
  getJS: (progress, time) => {
    let movementProgressFix = 0.02;

    let uFreq = xyUniforms.uFreq.value;
    let uAmp = xyUniforms.uAmp.value;

    let distortion = new THREE.Vector3(
      Math.cos(progress * Math.PI * uFreq.x + time) * uAmp.x -
        Math.cos(movementProgressFix * Math.PI * uFreq.x + time) * uAmp.x,
      Math.sin(progress * Math.PI * uFreq.y + time + Math.PI / 2) * uAmp.y -
        Math.sin(movementProgressFix * Math.PI * uFreq.y + time + Math.PI / 2) *
          uAmp.y,
      0
    );
    let lookAtAmp = new THREE.Vector3(2, 0.4, 1);
    let lookAtOffset = new THREE.Vector3(0, 0, -3);
    return distortion.multiply(lookAtAmp).add(lookAtOffset);
  }
};
