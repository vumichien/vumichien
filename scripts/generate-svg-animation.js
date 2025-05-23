const fs = require('fs');
const path = require('path');

function generateSvgAnimation(projectName) {
  if (!projectName) {
    console.error("Project name is required.");
    process.exit(1);
  }

  const width = 300;
  const height = 100;
  const textX = width / 2;
  const textY = height / 2;
  const fontSize = 20; // Adjust based on typical project name length

  // Sanitize project name for use as a filename
  const safeProjectName = projectName.replace(/[^a-zA-Z0-9-_]/g, '_');
  const outputDir = path.join(process.env.GITHUB_WORKSPACE || '.', 'dist', 'project-animations');
  const outputPath = path.join(outputDir, `${safeProjectName}-animation.svg`);

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const svgContent = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="background-color: transparent;">
  <defs>
    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
      <feOffset in="blur" dx="2" dy="2" result="offsetBlur"/>
      <feMerge>
        <feMergeNode in="offsetBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <!-- A more complex filter for a slight 3D effect could be added here -->
    <!-- For example, an attempt at a slight bevel -->
    <filter id="bevel" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="alphaBlur"/>
        <feOffset in="alphaBlur" dx="-1" dy="-1" result="offsetAlphaBlur"/>
        <feSpecularLighting in="alphaBlur" surfaceScale="5" specularConstant=".75" specularExponent="20" lighting-color="#bbbbbb" result="specOut">
            <fePointLight x="-5000" y="-10000" z="20000"/>
        </feSpecularLighting>
        <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut"/>
        <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litPaint"/>
        <feOffset dx="1" dy="1" in="litPaint" result="offsetLitPaint"/>
        <feMerge>
            <feMergeNode in="offsetLitPaint"/>
            <feMergeNode in="SourceGraphic"/>
        </feMerge>
    </filter>
  </defs>

  <style>
    .animatedText {
      font-family: Arial, Helvetica, sans-serif;
      font-size: ${fontSize}px;
      fill: #ffffff; /* White text */
      stroke: #333333; /* Dark stroke for definition */
      stroke-width: 0.5px;
      text-anchor: middle;
      dominant-baseline: middle;
      filter: url(#dropShadow); /* Apply drop shadow */
    }
  </style>

  <text x="${textX}" y="${textY}" class="animatedText">
    ${projectName}
    <animateTransform
      attributeName="transform"
      attributeType="XML"
      type="rotate"
      from="0 ${textX} ${textY}"
      to="5 ${textX} ${textY}" 
      dur="3s"
      repeatCount="indefinite"
      keyTimes="0; 0.5; 1" 
      values="0 ${textX} ${textY}; 2 ${textX} ${textY}; 0 ${textX} ${textY}" 
      calcMode="spline" 
      keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
    />
     <animate
        attributeName="opacity"
        values="0.7;1;0.7"
        dur="3s"
        repeatCount="indefinite"
        keyTimes="0; 0.5; 1"
        calcMode="spline"
        keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
      />
  </text>
</svg>
  `;

  fs.writeFileSync(outputPath, svgContent.trim());
  console.log(`Generated SVG: ${outputPath}`);
}

// Get project name from command line arguments
const projectName = process.argv[2];
if (!projectName) {
  console.error("Usage: node generate-svg-animation.js <projectName>");
  process.exit(1);
}

generateSvgAnimation(projectName);
