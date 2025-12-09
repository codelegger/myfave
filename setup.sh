#!/bin/bash

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_header() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Read required versions from project files
REQUIRED_NODE_VERSION=$(cat .nvmrc | tr -d '[:space:]')
REQUIRED_PNPM_VERSION="10.0.0"

print_header "🚀 Project Setup Script"

# Step 1: Check and setup direnv
print_header "Step 1: Setting up direnv"

if command -v direnv &> /dev/null; then
    print_success "direnv is already installed"
    DIRENV_VERSION=$(direnv --version 2>/dev/null || echo "unknown")
    print_info "direnv version: $DIRENV_VERSION"
else
    print_warning "direnv is not installed"

    if [[ "$OSTYPE" == "darwin"* ]]; then
        print_info "Installing direnv using Homebrew..."
        if command -v brew &> /dev/null; then
            brew install direnv
            print_success "direnv installed successfully"
        else
            print_error "Homebrew is not installed. Please install Homebrew first: https://brew.sh"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        print_info "Installing direnv using package manager..."
        if command -v apt-get &> /dev/null; then
            sudo apt-get update && sudo apt-get install -y direnv
        elif command -v yum &> /dev/null; then
            sudo yum install -y direnv
        else
            print_error "Please install direnv manually: https://direnv.net/docs/installation.html"
            exit 1
        fi
        print_success "direnv installed successfully"
    else
        print_error "Unsupported OS. Please install direnv manually: https://direnv.net/docs/installation.html"
        exit 1
    fi
fi

# Setup direnv hook in shell (if not already set up)
SHELL_RC=""
if [[ "$SHELL" == *"zsh"* ]]; then
    SHELL_RC="$HOME/.zshrc"
elif [[ "$SHELL" == *"bash"* ]]; then
    SHELL_RC="$HOME/.bashrc"
fi

if [ -n "$SHELL_RC" ] && ! grep -q "direnv hook" "$SHELL_RC" 2>/dev/null; then
    print_info "Adding direnv hook to $SHELL_RC..."
    echo 'eval "$(direnv hook '"${SHELL##*/}"')"' >> "$SHELL_RC"
    print_success "direnv hook added to $SHELL_RC"
    print_warning "Please restart your terminal or run: source $SHELL_RC"
fi

# Allow direnv for this project
if [ -f .envrc ]; then
    print_info "Allowing direnv for this project..."
    direnv allow . 2>/dev/null || print_warning "Could not run 'direnv allow'. You may need to run it manually after restarting your terminal."
fi

# Step 2: Check and setup nvm
print_header "Step 2: Setting up nvm"

if [ -s "$HOME/.nvm/nvm.sh" ]; then
    print_success "nvm is already installed"
    source "$HOME/.nvm/nvm.sh"
elif [ -s "/usr/local/opt/nvm/nvm.sh" ]; then
    print_success "nvm is already installed (Homebrew)"
    source "/usr/local/opt/nvm/nvm.sh"
else
    print_warning "nvm is not installed"
    print_info "Installing nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

    # Source nvm
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

    print_success "nvm installed successfully"
    print_warning "Please restart your terminal or run: source ~/.nvm/nvm.sh"
fi

# Source nvm if available
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    source "$HOME/.nvm/nvm.sh"
elif [ -s "/usr/local/opt/nvm/nvm.sh" ]; then
    source "/usr/local/opt/nvm/nvm.sh"
fi

# Step 3: Check and install Node.js version
print_header "Step 3: Setting up Node.js"

# Ensure nvm is sourced
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    source "$HOME/.nvm/nvm.sh"
elif [ -s "/usr/local/opt/nvm/nvm.sh" ]; then
    source "/usr/local/opt/nvm/nvm.sh"
fi

if ! command -v nvm &> /dev/null && [ ! -s "$HOME/.nvm/nvm.sh" ] && [ ! -s "/usr/local/opt/nvm/nvm.sh" ]; then
    print_error "nvm is not available. Please install nvm first or restart your terminal."
    exit 1
fi

CURRENT_NODE=$(node --version 2>/dev/null | sed 's/v//' || echo "")

if [ -n "$CURRENT_NODE" ]; then
    print_info "Current Node.js version: $CURRENT_NODE"
fi

print_info "Required Node.js version: $REQUIRED_NODE_VERSION"

# Check if the required version is installed using nvm
NVM_INSTALLED=$(nvm list "$REQUIRED_NODE_VERSION" 2>/dev/null | grep -q "$REQUIRED_NODE_VERSION" && echo "yes" || echo "no")

if [ "$NVM_INSTALLED" == "yes" ] || [ "$CURRENT_NODE" == "$REQUIRED_NODE_VERSION" ]; then
    print_success "Node.js $REQUIRED_NODE_VERSION is already installed"
    nvm use "$REQUIRED_NODE_VERSION" 2>/dev/null || print_info "Using Node.js $REQUIRED_NODE_VERSION"
else
    print_warning "Node.js $REQUIRED_NODE_VERSION is not installed"
    print_info "Installing Node.js $REQUIRED_NODE_VERSION..."
    nvm install "$REQUIRED_NODE_VERSION"
    nvm use "$REQUIRED_NODE_VERSION"
    print_success "Node.js $REQUIRED_NODE_VERSION installed and activated"
fi

# Verify Node.js version
ACTIVE_NODE=$(node --version | sed 's/v//')
if [ "$ACTIVE_NODE" == "$REQUIRED_NODE_VERSION" ]; then
    print_success "Node.js $REQUIRED_NODE_VERSION is active"
else
    print_warning "Active Node.js version is $ACTIVE_NODE, but $REQUIRED_NODE_VERSION is required"
    print_info "Switching to Node.js $REQUIRED_NODE_VERSION..."
    nvm use "$REQUIRED_NODE_VERSION" 2>/dev/null || {
        print_error "Failed to switch to Node.js $REQUIRED_NODE_VERSION"
        exit 1
    }
fi

# Verify Node.js installation
if ! command -v node &> /dev/null; then
    print_error "Node.js is not available. Please check your nvm installation."
    exit 1
fi

NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
print_success "Node.js: $NODE_VERSION"
print_success "npm: $NPM_VERSION"

# Step 4: Check and setup pnpm
print_header "Step 4: Setting up pnpm"

if command -v pnpm &> /dev/null; then
    CURRENT_PNPM=$(pnpm --version)
    print_info "Current pnpm version: $CURRENT_PNPM"

    # Check if version meets requirement (>=10.0.0)
    if pnpm --version | awk -v req="$REQUIRED_PNPM_VERSION" '{exit !($1 >= req)}'; then
        print_success "pnpm version $CURRENT_PNPM meets requirement (>= $REQUIRED_PNPM_VERSION)"
    else
        print_warning "pnpm version $CURRENT_PNPM is below required version $REQUIRED_PNPM_VERSION"
        print_info "Updating pnpm..."
        npm install -g pnpm@latest
        print_success "pnpm updated successfully"
    fi
else
    print_warning "pnpm is not installed"
    print_info "Installing pnpm..."
    npm install -g pnpm@latest
    print_success "pnpm installed successfully"
fi

PNPM_VERSION=$(pnpm --version)
print_success "pnpm: $PNPM_VERSION"

# Step 5: Install dependencies
print_header "Step 5: Installing dependencies"

if [ -f "pnpm-lock.yaml" ]; then
    print_info "Installing dependencies using pnpm..."
    pnpm install
    print_success "Dependencies installed successfully"
else
    print_info "No lockfile found. Installing dependencies..."
    pnpm install
    print_success "Dependencies installed successfully"
fi

# Step 6: Setup Husky
print_header "Step 6: Setting up Husky"

if [ -d ".git" ]; then
    print_info "Setting up Husky git hooks..."
    pnpm prepare
    print_success "Husky setup completed"
else
    print_warning "Not a git repository. Skipping Husky setup."
fi

# Step 7: Install Playwright browsers
print_header "Step 7: Installing Playwright browsers"

if [ -f "playwright.config.ts" ] || [ -f "playwright.config.js" ]; then
    print_info "Installing Playwright browsers..."
    pnpm exec playwright install --with-deps chromium || pnpm exec playwright install chromium
    print_success "Playwright browsers installed"
else
    print_info "No Playwright config found. Skipping browser installation."
fi

# Final summary
print_header "✅ Setup Complete!"

echo -e "${GREEN}All setup steps completed successfully!${NC}\n"
echo -e "Summary:"
echo -e "  ${GREEN}✓${NC} direnv: $(direnv --version 2>/dev/null || echo 'installed')"
echo -e "  ${GREEN}✓${NC} Node.js: $(node --version)"
echo -e "  ${GREEN}✓${NC} npm: $(npm --version)"
echo -e "  ${GREEN}✓${NC} pnpm: $(pnpm --version)"
echo -e "  ${GREEN}✓${NC} Dependencies installed"
echo -e "  ${GREEN}✓${NC} Husky configured"
echo -e "  ${GREEN}✓${NC} Playwright browsers installed\n"

print_warning "Important: If this is your first time setting up direnv or nvm,"
print_warning "please restart your terminal or run:"
echo -e "  ${YELLOW}source ~/.zshrc${NC}  (or ${YELLOW}source ~/.bashrc${NC} for bash)\n"

print_info "You can now start developing:"
echo -e "  ${BLUE}pnpm dev${NC}        - Start development server"
echo -e "  ${BLUE}pnpm test${NC}       - Run unit tests"
echo -e "  ${BLUE}pnpm test:e2e${NC}   - Run E2E tests"
echo -e "  ${BLUE}pnpm lint${NC}       - Run linter\n"

