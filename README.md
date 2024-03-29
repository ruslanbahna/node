# node
Dockerfile


```Dockerfile
# Use the official Ubuntu base image as a starting point
FROM ubuntu:latest

# Install dependencies required for nvm and Node.js
RUN apt-get update && \
    apt-get install -y curl git ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Install nvm
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 21.6.1

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash && \
    . "$NVM_DIR/nvm.sh" && \
    nvm install $NODE_VERSION && \
    nvm use $NODE_VERSION && \
    nvm alias default $NODE_VERSION

# Add nvm, Node.js, and npm to PATH
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Verify installation
RUN node --version && npm --version

# Your container's CMD or ENTRYPOINT here
# For example, start a bash shell
CMD [ "bash" ]
```

# Node.js Performance Benchmarking

This repository contains a set of performance benchmarks for Node.js, designed to measure the execution speed of various common operations such as computational tasks, data manipulation, and asynchronous operations.

## Overview

The benchmarks are implemented using the [Benchmark.js](https://benchmarkjs.com/) library, which provides a robust framework for timing code execution in JavaScript. The tests are designed to run in a GitHub Actions workflow, ensuring a consistent environment for each test run.

## Benchmarks

The suite includes the following benchmarks:

- **Fibonacci Recursive**: Measures the performance of a recursive function by computing the 30th number in the Fibonacci sequence.
- **Array Sorting**: Evaluates the efficiency of sorting a small array of random numbers.
- **String Manipulation**: Tests the speed of appending characters to a string in a loop.
- **Map Operations**: Assesses the performance of adding and accessing elements in a Map data structure.
- **Set Operations**: Measures the efficiency of adding elements to a Set.
- **JSON Parsing**: Tests the speed of parsing a JSON string into an object.
- **RegExp Matching**: Evaluates the performance of a regular expression match against a sample string.
- **Math Operations**: Measures the speed of performing a square root calculation in a loop.

Additionally, the suite includes three asynchronous benchmarks:

- **Async Operation Example**: A simulated asynchronous task that resolves after a fixed delay, demonstrating how to benchmark asynchronous operations.
- **Simulated Async File Read**: Mimics the process of reading file content asynchronously by resolving after a simulated delay, without the need for actual file I/O.
- **Async Delayed Computation**: Simulates a more CPU-intensive asynchronous task with a fixed delay to represent computation.

## Running the Benchmarks

The benchmarks are designed to run within a GitHub Actions workflow, which is triggered on every push to the repository. The workflow sets up a Node.js environment, installs dependencies, and executes the benchmark suite.

To run the benchmarks manually, you can execute the Node.js command provided in the workflow file. Ensure you have Node.js and the Benchmark.js library installed in your environment.

## Interpreting Results

After each benchmark run, the results are logged to the console, displaying the execution time for each test. The suite also identifies the fastest benchmark, providing insights into which operations are most efficient under the current Node.js version and environment settings.

## Customizing Benchmarks

You can customize or extend the benchmark suite by adding new tests to the `suite` object in the Node.js command. Each test should define the code to be benchmarked, and if it's asynchronous, it should use the `defer` option and `deferred.resolve()` to signal completion.

## Conclusion

This benchmarking suite offers a starting point for assessing and comparing the performance of various operations in Node.js. By understanding the execution characteristics of different code snippets, developers can make informed decisions to optimize their applications for speed and efficiency.

Total Execution Time: The total execution time for the benchmark suite is fairly consistent across all environments, with slight variations. This indicates that while individual benchmark performance may vary, the overall performance impact of the container environment on this set of Node.js benchmarks is relatively small.

Conclusion:
The choice of container image can have an impact on specific Node.js operations, particularly those involving data handling and computational tasks. However, the overall execution time of the benchmark suite is relatively consistent across different environments, suggesting that for a broad set of tasks, the impact of the container environment may be minimal. When optimizing for specific operations, it may be beneficial to conduct targeted benchmarks similar to these in the relevant environments to identify any potential performance bottlenecks or optimizations.



Based on the article, Alpine Linux, with its musl libc, initially seems ideal for containerized environments due to its small size. However, significant performance drawbacks in multithreading contexts were observed, making it less suitable for applications requiring high concurrency. While Alpine offers a compact and efficient base, these issues suggest careful consideration of specific use cases. For high-performance, multi-threaded applications, exploring alternatives or using mimalloc with Alpine might mitigate some concerns, balancing Alpine's size advantages with the need for efficiency.


The article suggests Alpine Linux is great for its small size, but has problems with tasks that do many things at once, making it slow for some apps. It's good for simple jobs but for complex ones, you might need a workaround or a different choice.

take this conclusion and also results from ptoton and alpine and do a general conclusion why we selected photon to harden aour image for future uses
Considering the article's insights on Alpine's multithreading limitations and our benchmark results, we've chosen Photon to harden our image for future use. Photon showed better performance in key areas, aligning with our need for a robust and efficient environment for complex applications.



```yaml
  node-performance-test-ubuntu-with-package:
    runs-on: ubuntu-latest
    container:
      image: ubuntu:latest

    steps:
      - name: Install curl
        run: |
          apt-get update
          apt-get install -y curl bc 

      - name: Capture pre-installation package state
        run: dpkg-query -W --showformat='${Installed-Size}\t${Package}\n' > /tmp/pre_install_packages.txt


      - name: Setup Node.js and Install Packages
        run: |
          curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
          apt-get install -y nodejs
          npm install -g yarn
 

      - name: Capture post-installation package state
        run: dpkg-query -W --showformat='${Installed-Size}\t${Package}\n' > /tmp/post_install_packages.txt
 

      - name: Compare package states and calculate total size
        run: |
          echo "Newly installed packages and their sizes (in KB):"
          grep -vxFf /tmp/pre_install_packages.txt /tmp/post_install_packages.txt
          total_size_kb=$(grep -vxFf /tmp/pre_install_packages.txt /tmp/post_install_packages.txt | awk '{s+=$1} END {print s}')
          echo "Total size of newly installed packages: ${total_size_kb} KB"
          total_size_mb=$(echo "scale=2; ${total_size_kb} / 1024" | bc)
          echo "Total size of newly installed packages: ${total_size_mb} MB"
          ```
| Task                        | ubuntu:latest       | photon:latest       |
|-----------------------------|---------------------|---------------------|
| Async Operation Example     | 9.97 ops/sec       | 9.98 ops/sec       |
| Simulated Async File Read   | 19.91 ops/sec      | 19.93 ops/sec      |
| Async Delayed Computation   | 9.86 ops/sec       | 9.87 ops/sec       |
| Fibonacci Recursive         | 63.39 ops/sec      | 63.71 ops/sec      |
| Array Sorting               | 618,632 ops/sec    | 600,693 ops/sec    |
| String Manipulation         | 11,712,551 ops/sec | 11,691,481 ops/sec |
| Map Operations              | 3,215,043 ops/sec  | 3,116,709 ops/sec  |
| Set Operations              | 3,612,585 ops/sec  | 3,545,749 ops/sec  |
| JSON Parsing                | 266,988 ops/sec    | 267,321 ops/sec    |
| RegExp Matching             | 55,421,845 ops/sec | 55,927,758 ops/sec |
| Math Operations             | 165,080,439 ops/sec| 165,029,590 ops/sec|
| Total execution time        | 65120 ms            | 64265 ms            |





