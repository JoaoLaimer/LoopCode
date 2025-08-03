package com.loopcode.loopcode.dtos;

public class TestCaseResultDto {
    private int testCaseNumber;
    private String output;
    private String expectedOutput;
    private boolean passed;

    public TestCaseResultDto(int testCaseNumber, String output, String expectedOutput, boolean passed) {
        this.testCaseNumber = testCaseNumber;
        this.output = output;
        this.expectedOutput = expectedOutput;
        this.passed = passed;
    }

    public int getTestCaseNumber() { return testCaseNumber; }
    public void setTestCaseNumber(int testCaseNumber) { this.testCaseNumber = testCaseNumber; }

    public String getOutput() { return output; }
    public void setOutput(String output) { this.output = output; }

    public String getExpectedOutput() { return expectedOutput; }
    public void setExpectedOutput(String expectedOutput) { this.expectedOutput = expectedOutput; }

    public boolean isPassed() { return passed; }
    public void setPassed(boolean passed) { this.passed = passed; }
}
