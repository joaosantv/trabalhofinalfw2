package com.genshin.planner.service;

import com.genshin.planner.dto.AuthResponseDTO;
import com.genshin.planner.dto.LoginRequestDTO;
import com.genshin.planner.dto.RegisterRequestDTO;
import com.genshin.planner.exception.ConflictException;
import com.genshin.planner.model.Usuario;
import com.genshin.planner.repository.UsuarioRepository;
import com.genshin.planner.security.JwtService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponseDTO registrar(RegisterRequestDTO dto) {
        String email = dto.email().trim().toLowerCase();
        if (usuarioRepository.existsByEmail(email)) {
            throw new ConflictException("Já existe um usuário cadastrado com o e-mail: " + email);
        }
        Usuario usuario = usuarioRepository.save(
                new Usuario(dto.nome().trim(), email, passwordEncoder.encode(dto.senha())));
        return new AuthResponseDTO(jwtService.gerarToken(usuario.getEmail()), usuario.getNome(), usuario.getEmail());
    }

    @Transactional(readOnly = true)
    public AuthResponseDTO login(LoginRequestDTO dto) {
        Usuario usuario = usuarioRepository.findByEmail(dto.email().trim().toLowerCase())
                .filter(u -> passwordEncoder.matches(dto.senha(), u.getSenha()))
                .orElseThrow(() -> new BadCredentialsException("E-mail ou senha inválidos"));
        return new AuthResponseDTO(jwtService.gerarToken(usuario.getEmail()), usuario.getNome(), usuario.getEmail());
    }
}
