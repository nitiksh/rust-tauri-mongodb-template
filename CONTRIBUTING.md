# Contributing

Contributions are welcome!

## How to Contribute

### Bug Reports

Open an issue with:

- Clear description
- Steps to reproduce
- Your environment (OS, Node, Rust versions)

### Pull Requests

1. Fork the repository
2. Create your branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m 'Add feature'`
6. Push: `git push origin feature/my-feature`
7. Open a Pull Request

### Setup

```bash
git clone https://github.com/nitiksh/rust-tauri-mongodb-template.git
cd ui && npm install
cd ../src-tauri && cp .env.example .env
cargo tauri dev
```

## Code Style

- **Rust**: Use `rustfmt`
- **React**: Modern ES6+, keep components simple

Thank you! 🎉
