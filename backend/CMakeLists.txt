cmake_minimum_required(VERSION 3.10)
project(AutomotiveDigitalCockpit)

set(CMAKE_CXX_STANDARD 17)

include_directories(include)

add_executable(cockpit main.cpp src/api.cpp src/telemetry_handler.cpp model/interface.cpp)
