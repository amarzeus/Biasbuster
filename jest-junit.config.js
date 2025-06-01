module.exports = {
  // Output configuration
  reporterEnabled: "jest-junit",
  jestJunit: {
    outputDirectory: "./test-results/junit/",
    outputName: "junit.xml",
    uniqueOutputName: "false",
    classNameTemplate: "{classname}-{title}",
    titleTemplate: "{title}",
    ancestorSeparator: " › ",
    usePathForSuiteName: "true",
    
    // Additional test result data
    addFileAttribute: "true",
    includeConsoleOutput: "true",
    includeShortConsoleOutput: "true",
    
    // Execution environment info
    reportTestSuiteErrors: "true",
    includeExecutionTime: "true",
    
    // Test case properties
    suiteNameTemplate: "{filepath}",
    testCaseTemplate: "{title}",
    
    // XML configuration
    xmlVersion: "1.0",
    stylesheet: "./junit-viewer.xsl"
  }
};
