package com.mlp.lab.service;

import java.util.LinkedHashMap;
import java.util.Optional;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import com.mlp.lab.dto.UserDto;
import com.mlp.lab.entity.User;
import com.mlp.lab.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class UserService {
  // final 붙여야지 생성자 만들어줌(RequiredArgsConstructor)
  // private final ModelMapper modelMapper;
  private final UserRepository userRepository;

  // 이럴 때 비밀번호는 인코딩해서 넣어줘야된다.(스프링 시큐리티)
  // private final PasswordEncoder passwordEncoder;

  // 사용자가 DB에 없다면 새로운 데이터를 추가해줘야된다.
  public void save(User user) {
    userRepository.save(user);
  }

  public User findByEmail(String email) {
    return userRepository.findUserByEmail(email);
  }

  public User findId(String name, String phone) {
    return userRepository.findByNameAndPhone(name, phone);
  }

  @Transactional
  // 회원가입 (등록, 이미지 포함)
  public void add(UserDto userDto) {
    // User 엔티티 생성 및 저장
    User user = User.createUser(userDto);
    userRepository.save(user);
  }

  // 회원정보 조회
  public Optional<User> get(Long id) {
    Optional<User> result = userRepository.findById(id);
    return result;
  }

  // 중복 이메일 체크
  @Transactional
  public boolean checkEmailDuplicate(String email) {
    return userRepository.existsByEmail(email);
  }

  // 중복 닉네임 체크
  @Transactional
  public boolean checkNicknameDuplicate(String nickname) {
    return userRepository.existsByNickname(nickname);
  }

  // 회원정보 수정
  public void modifyUserInfo(UserDto userDto) {
    // 1. 조회
    Optional<User> result = userRepository.findById(userDto.getId());
    User user = result.orElseThrow(); // 예외 처리 필요

    // 2. 수정
    user.setName(userDto.getName());
    user.setPhone(userDto.getPhone());
    user.setNickname(userDto.getNickname());
    user.setPwd(userDto.getPwd());
    user.setAddr(userDto.getAddr());
    user.setDetailAddr(userDto.getDetailAddr());
    user.setLocation(userDto.getLocation());
    user.setLatitude(userDto.getLatitude()); // 위도
    user.setLongitude(userDto.getLongitude()); // 경도

    // 이미지 파일이 업로드되었을 경우에만 수정
    if (userDto.getUploadFileName() != null && !userDto.getUploadFileName().isEmpty()) {
        user.setProfileImage(userDto.getUploadFileName());
    }

    userRepository.save(user);
}

  ////////////////////////////////////////////////////////////////////////////////
  // 카카오 연동해서 accessToken을 이용해서 카카오api에 등록된 사용자 정보 가져오는 함수
  public UserDto getKakaoMember(String accessToken) {

    // 카카오 이메일, 닉네임
    String email = getEmailFromKakaoAccessToken(accessToken); // 이메일 정보
    String nickname = getNicknameFromKakaoAccessToken(accessToken); // 닉네임 정보

    // 현재 DB에 카카오 이메일 계정이 있는지 확인
    Optional<User> result = userRepository.findByEmail(email);

    // 1. DB에 이메일이 있는 경우
    if (result.isPresent()) {
      UserDto userDto = User.entityToDto(result.get());
      log.info("기존 DB에 존재하는 이메일 계정 정보: " + userDto);
      return userDto;
    }

    // 2. DB에 이메일이 없는 경우
    User socialUser = makeSocialUser(email, nickname); // 이메일, 닉네임 정보 받아서 entity 생성
    userRepository.save(socialUser); // DB에 저장
    UserDto userDto = User.entityToDto(socialUser); // DTO로 바꿔서 전달

    return userDto;
  }

  // 회원 생성 함수(기존 DB에 없을 때 사용)
  private User makeSocialUser(String email, String nickname) {

    // String tempPassword = makeTempPassword();

    User user = User.builder()
        .email(email)
        // .pwd(tempPassword)
        // .pwd(passwordEncoder.encode(tempPassword))
        .nickname(nickname)
        // .social(true)
        .build();

    // member.addRole(MemberRole.USER); // 사용자 권한 부여
    return user;
  }

  ///////////////////////////////////////////////////////////////////
  // 10자리의 비밀번호를 만들어주는 함수 (필수로 사용 안해도 됨)
  private String makeTempPassword() {
    StringBuffer buffer = new StringBuffer();
    for (int i = 0; i < 10; i++) {
      buffer.append((char) ((int) (Math.random() * 55) + 65));
    } // 랜덤하게 비밀번호 만듦
    return buffer.toString();
  }

  // 이메일 반환 함수
  private String getEmailFromKakaoAccessToken(String accessToken) {

    String kakaoGetUserURL = "https://kapi.kakao.com/v2/user/me"; // 현재 로그인 한 사용자 정보 가져오기

    RestTemplate restTemplate = new RestTemplate();

    // 사용자 엑세스 토큰을 헤더에 담아 get 요청 보냄
    HttpHeaders headers = new org.springframework.http.HttpHeaders();
    headers.add("Authorization", "Bearer " + accessToken); // 인증방식, 엑세스 토큰으로 인증 요청
    headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8"); // 요청 데이터 타입

    HttpEntity<String> entity = new HttpEntity<>(headers);

    UriComponents uriBuilder = UriComponentsBuilder.fromHttpUrl(kakaoGetUserURL).build();

    ResponseEntity<LinkedHashMap> response = restTemplate.exchange(uriBuilder.toUri(), HttpMethod.GET, entity,
        LinkedHashMap.class);

    log.info("response..........................................");
    log.info(response);

    LinkedHashMap<String, LinkedHashMap> bodyMap = response.getBody();

    log.info("--------------------------------------------------");
    log.info(bodyMap);

    LinkedHashMap<String, String> kakaoAccount = bodyMap.get("kakao_account");
    LinkedHashMap<String, String> properties = bodyMap.get("properties");
    log.info("kakaoAccount: " + kakaoAccount);
    log.info("properties: " + properties);

    String email = kakaoAccount.get("email"); // 이메일 정보
    String gender = kakaoAccount.get("gender"); // 성별 정보
    String nickname = properties.get("nickname"); // 닉네임 정보
    String profile_image = properties.get("profile_image"); // 프로필 이미지

    log.info("카카오 계정 이메일: " + email);
    log.info("사용자 성별: " + gender);
    log.info("카카오 계정 닉네임: " + nickname);
    log.info("프로필 이미지: " + profile_image);

    return email;
  }

  // 닉네임 반환 함수
  private String getNicknameFromKakaoAccessToken(String accessToken) {

    String kakaoGetUserURL = "https://kapi.kakao.com/v2/user/me";

    RestTemplate restTemplate = new RestTemplate();

    HttpHeaders headers = new org.springframework.http.HttpHeaders();
    headers.add("Authorization", "Bearer " + accessToken);
    headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

    HttpEntity<String> entity = new HttpEntity<>(headers);

    UriComponents uriBuilder = UriComponentsBuilder.fromHttpUrl(kakaoGetUserURL).build();

    ResponseEntity<LinkedHashMap> response = restTemplate.exchange(uriBuilder.toUri(), HttpMethod.GET, entity,
        LinkedHashMap.class);

    LinkedHashMap<String, LinkedHashMap> bodyMap = response.getBody();
    LinkedHashMap<String, String> properties = bodyMap.get("properties");
    String nickname = properties.get("nickname"); // 닉네임 정보

    return nickname;
  }

  //회원의 위도,경도 정보 수정
  public void modifyLocation(Long id, double latitude, double longitude,String location) {
    Optional<User> result = userRepository.findById(id); // 아이디로 조회
    User user = result.orElseThrow();
    user.setLatitude(latitude); // 위도
    user.setLongitude(longitude); // 경도
    user.setLocation(location);
    userRepository.save(user);
  }
}