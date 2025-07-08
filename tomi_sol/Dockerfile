FROM ubuntu:22.04

# Set the working directory
WORKDIR /app

# Install Python, pip, and other dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    && apt-get clean

# Copy requirements.txt and install Python dependencies
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy the application code
COPY moderation_check.py .

# Set the default command to run the Flask app
ENTRYPOINT ["bash"]