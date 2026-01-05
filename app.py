import streamlit as st
import google.generativeai as genai

# =========================================================
# 1. CẤU HÌNH API KEY (Duy nhất 1 chỗ này)
# =========================================================
# Anh Tuấn dán mã API Key vào giữa hai dấu ngoặc kép dưới đây:
MY_API_KEY = "AIzaSyCTiPWA0c9UECJ8gTtps-g9N8eciGUaVyg"

# =========================================================
# 2. DANH MỤC ÔN THI CHI TIẾT 7 MÔN (Bám sát SGK & Đề thi)
# =========================================================
MENU_ON_THI = {
    "Môn Toán": [
        "Rút gọn biểu thức và bài toán liên quan",
        "Giải hệ phương trình bậc nhất 2 ẩn",
        "Phương trình bậc hai & Hệ thức Vi-ét",
        "Toán Chuyển động / Năng suất / Hình học",
        "Hàm số y = ax^2 và đường thẳng y = ax + b",
        "Tứ giác nội tiếp và Hình học đường tròn",
        "Hình trụ - Hình nón - Hình cầu",
        "Bài toán bất đẳng thức & Cực trị (Câu lấy điểm 10)"
    ],
    "Môn Ngữ Văn": [
        "Nghị luận xã hội (Tư tưởng đạo lý / Hiện tượng đời sống)",
        "Truyện: Làng - Lặng lẽ Sa Pa - Chiếc lược ngà",
        "Thơ: Đồng chí - Bài thơ về tiểu đội xe không kính",
        "Thơ: Đoàn thuyền đánh cá - Bếp lửa - Sang thu",
        "Thơ: Viếng lăng Bác - Nói với con",
        "Văn bản nhật dụng & Kỹ năng đọc hiểu",
        "Cách lập dàn ý và viết mở bài/kết bài ấn tượng",
        "Các thành phần biệt lập & Liên kết câu"
    ],
    "Môn Tiếng Anh": [
        "Hệ thống 12 Thì (Tenses) trọng tâm",
        "Câu bị động (Passive Voice) & Câu gián tiếp",
        "Câu điều kiện (Type 1, 2) & Câu ước (Wish)",
        "Mệnh đề quan hệ (Relative Clauses)",
        "Cấu trúc so sánh & Cụm động từ (Phrasal Verbs)",
        "Trọng âm & Phát âm (Phonetics)",
        "Kỹ năng làm bài Đọc hiểu & Điền từ",
        "Viết lại câu sao cho nghĩa không đổi"
    ],
    "Môn Vật Lý": [
        "Điện trở - Định luật Ôm - Đoạn mạch nối tiếp/song song",
        "Công suất điện - Điện năng tiêu thụ (Định luật Joule-Lenser)",
        "Hiện tượng cảm ứng điện từ - Máy biến thế",
        "Hiện tượng khúc xạ ánh sáng",
        "Thấu kính hội tụ & Thấu kính phân kỳ",
        "Sự tạo ảnh trong Mắt - Máy ảnh - Kính lúp",
        "Định luật bảo toàn và chuyển hóa năng lượng"
    ],
    "Môn Hóa Học": [
        "Oxide - Acid - Base - Muối (Tính chất & Phản ứng)",
        "Mối quan hệ giữa các hợp chất vô cơ",
        "Kim loại (Al, Fe) & Phi kim (Cl, C, Si)",
        "Bảng tuần hoàn các nguyên tố hóa học",
        "Hydrocarbon: Methane, Ethylene, Acetylene, Benzene",
        "Dẫn xuất Hydrocarbon: Rượu Ethyl, Axit Axetic",
        "Chất béo - Protein - Polyme",
        "Bài toán tính theo phương trình & nồng độ dung dịch"
    ],
    "Môn Lịch Sử": [
        "Lịch sử thế giới sau 1945 (Liên Xô, Mỹ, Nhật, Á-Phi-Mỹ Latinh)",
        "Các cuộc cách mạng khoa học - kỹ thuật",
        "Lịch sử VN 1919 - 1930 (Đảng ra đời)",
        "Cuộc vận động tiến tới CMT8 năm 1945",
        "Kháng chiến chống Pháp (1946 - 1954)",
        "Kháng chiến chống Mỹ (1954 - 1975)",
        "Lịch sử VN từ 1975 đến nay"
    ],
    "Môn Địa Lý": [
        "Địa lý dân cư & Các loại hình quần cư VN",
        "Các ngành kinh tế (Nông nghiệp, Công nghiệp, Dịch vụ)",
        "Vùng Trung du và miền núi Bắc Bộ",
        "Vùng Đồng bằng sông Hồng & Bắc Trung Bộ",
        "Vùng Duyên hải Nam Trung Bộ & Tây Nguyên",
        "Vùng Đông Nam Bộ & Đồng bằng sông Cửu Long",
        "Phát triển kinh tế biển & Đảo",
        "Kỹ năng vẽ và phân tích biểu đồ Địa lý"
    ]
}

# =========================================================
# 3. GIAO DIỆN APP (UI)
# =========================================================
st.set_page_config(page_title="Quà Tặng Anh Khoa", page_icon="🛡️", layout="wide")

st.markdown(f"""
    <style>
    .stApp {{ background-color: #f4f7f6; }}
    .main-header {{ 
        background-color: #1a2a6c; padding: 30px; border-radius: 20px; 
        color: white; text-align: center; margin-bottom: 30px;
    }}
    </style>
    <div class="main-header">
        <h1>🌟 LỘ TRÌNH ÔN THI CHUYỂN CẤP TOÀN DIỆN</h1>
        <h2 style="color: #fdbb2d;">Bố Tuấn thiết kế riêng cho Anh Khoa</h2>
        <p>Con trai hãy vững tin, bố luôn đồng hành cùng con!</p>
    </div>
    """, unsafe_allow_html=True)

# Sidebar chọn môn
with st.sidebar:
    st.title("📚 CHỌN MÔN HỌC")
    subject = st.radio("", list(MENU_ON_THI.keys()))
    st.markdown("---")
    st.markdown("### 🎯 CHUYÊN ĐỀ")
    selected_topic = st.selectbox("Kích chọn học ngay:", ["Chọn nội dung..."] + MENU_ON_THI[subject])

# =========================================================
# 4. KẾT NỐI AI & XỬ LÝ (LOGIC)
# =========================================================

# Kiểm tra API Key có tồn tại và không phải là chuỗi mặc định không
if MY_API_KEY and MY_API_KEY != "DÁN_API_KEY_THẬT_CỦA_ANH_VÀO_ĐÂY":
    try:
        genai.configure(api_key=MY_API_KEY)
        
        # Thiết lập Prompt hệ thống chuyên sâu
        sys_msg = f"""Bạn là siêu gia sư ôn thi vào lớp 10 giúp Anh Khoa học môn {subject}. 
        Mọi câu trả lời PHẢI bắt đầu bằng: 'Chào Anh Khoa, bố Tuấn đã chuẩn bị bài học này cho con...'
        Nội dung bám sát SGK lớp 9 và cấu trúc đề thi thực tế. 
        Giải thích dễ hiểu, trình bày lời giải mẫu mực và chỉ ra các bẫy thường gặp."""

        model = genai.GenerativeModel(model_name="gemini-1.5-flash", system_instruction=sys_msg)

        if "messages" not in st.session_state:
            st.session_state.messages = []

        # Reset chat khi đổi môn
        if "current_sub" not in st.session_state: 
            st.session_state.current_sub = subject
        if st.session_state.current_sub != subject:
            st.session_state.messages = []
            st.session_state.current_sub = subject

        # Hiển thị lịch sử chat
        for m in st.session_state.messages:
            with st.chat_message(m["role"]): st.markdown(m["content"])

        # Xử lý chọn từ mục lục
        if selected_topic != "Chọn nội dung...":
            prompt = f"Dạy cho con chuyên sâu về: {selected_topic}"
            # Chỉ gửi nếu tin nhắn cuối cùng không phải là chính nó
            if not st.session_state.messages or st.session_state.messages[-1]["content"] != prompt:
                st.session_state.messages.append({"role": "user", "content": prompt})
                with st.spinner("Thầy đang soạn bài giảng cho con..."):
                    response = model.generate_content(prompt)
                    st.session_state.messages.append({"role": "assistant", "content": response.text})
                    st.rerun()

        # Chat tự do
        if user_in := st.chat_input("Anh Khoa cần hỏi thêm điều gì không?"):
            st.session_state.messages.append({"role": "user", "content": user_in})
            with st.chat_message("user"): st.markdown(user_in)
            with st.chat_message("assistant"):
                resp = model.generate_content(user_in)
                st.markdown(resp.text)
                st.session_state.messages.append({"role": "assistant", "content": resp.text})
                if "đúng" in resp.text.lower() or "giỏi" in resp.text.lower():
                    st.balloons()

    except Exception as e:
        st.error(f"Lỗi API: {e}")
else:
    # Thông báo nếu chưa dán Key
    st.error("Bố Tuấn ơi, anh chưa dán API Key vào dòng số 13 rồi!")
    st.info("Anh hãy mở code ra, tìm dòng số 13 và dán mã API Key vào giữa hai dấu ngoặc kép nhé.")

st.markdown('<p style="text-align: center; color: gray; margin-top: 50px;">Yêu con trai nhiều! - Bố Tuấn</p>', unsafe_allow_html=True)