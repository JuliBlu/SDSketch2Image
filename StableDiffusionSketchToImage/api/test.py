import sys

try:
    import aiohttp
    import multipart
except ImportError:
    print("Multipart is not installed correctly.")
    sys.exit(1)

print("Multipart is installed correctly.")
print(multipart.__version__)